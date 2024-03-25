import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDetails } from './user-details';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `https://reqres.in/api/users`;
  private currentPage = 1;
  private usersCache: Map<number, UserDetails[]> = new Map();
  private usersSubject = new BehaviorSubject<UserDetails[]>([]);
  private totalUsers = new BehaviorSubject<number>(12);
  private pageSize = new BehaviorSubject<number>(6);
  private isLoading = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<string>('');

  constructor() {}

  private async loadUsersPage(page: number): Promise<UserDetails[]> {
    this.isLoading.next(true);
    const url = `${this.baseUrl}?page=${page}`;
    try {
      const data = await fetch(url);
      const response = await data.json();
      const userDetailsList = response.data ?? [];
      const totalUsers =  response.total ? response.total : this.totalUsers;
      const pageSize =  response.per_page ? response.per_page : this.pageSize;
      this.totalUsers.next(totalUsers);
      this.pageSize.next(pageSize);
      setTimeout(() => {
        this.isLoading.next(false);
      }, 300);

      return userDetailsList.map((user: any) => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar: user.avatar
      }));
    } catch (error) {
      setTimeout(() => {
        this.isLoading.next(false);
      }, 300);
      this.error.next('Something went wrong, please try again later.');
      console.error('Error fetching user details:', error);
      return [];
    }
  }

  private async getUsersPage(page: number): Promise<UserDetails[]> {
    if (this.usersCache.has(page)) {
      return this.usersCache.get(page)!;
    } else {
      const users = await this.loadUsersPage(page);
      this.usersCache.set(page, users);
      return users;
    }
  }

  async loadAllUsersDetails(page: number): Promise<void> {
    this.error.next('');
    const users = await this.getUsersPage(page);
    this.currentPage = page;
    this.usersSubject.next(users);
  }

  getAllUsersDetails(): Observable<UserDetails[]> {
    return this.usersSubject.asObservable();
  }

  getTotalUser(): Observable<number> {
    return this.totalUsers.asObservable();
  }

  getPageSize(): Observable<number> {
    return this.pageSize.asObservable();
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  getError(): Observable<string> {
    return this.error.asObservable();
  }

  async getUserDetailsById(id: number): Promise<UserDetails | undefined> {
    this.error.next('');
    if(!id) {
      this.usersSubject.next(this.usersCache.get(this.currentPage)!);
        return undefined;
    }
    try {
      for (const users of this.usersCache.values()) {
        const user = users.find(user => user.id === id);
        if (user) {
          return user;
        }
      }
      this.isLoading.next(true);
      const response = await fetch(`${this.baseUrl}/${id}`);
      const data = await response.json();

      setTimeout(() => {
        this.isLoading.next(false);
      }, 300);
  
      if (data && data.data) {
        const userData = data.data;
        const userDetails: UserDetails = {
          id: userData.id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          avatar: userData.avatar
        };

        const users = this.usersCache.get(0) || [];
        this.usersCache.set(0, [...users, userDetails]);
        return userDetails;
      } else {
        this.error.next('Nothing to show, user not found');
        return undefined;
      }
    } catch (error) {
        this.error.next('Something went wrong, please try again later.');
        setTimeout(() => {
          this.isLoading.next(false);
        }, 300);
        console.error('Error fetching user details:', error);
      return undefined;
    }
  }

  updateUserList(users: UserDetails[]) {
    this.usersSubject.next(users);
  }
}
