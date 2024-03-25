import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
// import { BrowserModule } from '@angular/platform-browser';

import { UserDetails } from '../user-details';
import { UserService } from '../user.service';
import { UserItemComponent } from '../user-item/user-item.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, UserItemComponent, MatPaginatorModule, MatProgressSpinnerModule,
    MatCardModule]
})
export class HomeComponent implements OnInit, OnDestroy {
  filteredUserList: UserDetails[] = [];
  totalUsers = 0;
  currentPageIndex = 0;
  pageSize = 0;
  isLoading = false;
  error = ''
  private userSubscription!: Subscription;
  private totalUsersSubscription!: Subscription;
  private pageSizeSubscription!: Subscription;
  private loadingSubscription!: Subscription;
  private errorSubscription!: Subscription;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.loadAllUsersDetails(1);
    this.userSubscription = this.userService.getAllUsersDetails().subscribe((userDetailsList: UserDetails[]) => {
      this.filteredUserList = userDetailsList;
    });
    this.totalUsersSubscription = this.userService.getTotalUser().subscribe((totalUsers: number) => {
      this.totalUsers = totalUsers;
    });
    this.pageSizeSubscription = this.userService.getPageSize().subscribe((pageSize: number) => {
      this.pageSize = pageSize;
    });
    this.loadingSubscription = this.userService.getIsLoading().subscribe((loading: boolean) => {
      this.isLoading = loading;
    });
    this.errorSubscription = this.userService.getError().subscribe((error: string) => {
      this.error = error;
    });
  }

  onPageChange(event: any) {
    const page = event.pageIndex + 1;
    this.currentPageIndex = event.pageIndex;
    this.userService.loadAllUsersDetails(page);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.totalUsersSubscription.unsubscribe();
    this.pageSizeSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
