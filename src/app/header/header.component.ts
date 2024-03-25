import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../user.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  title = "header";
  private searchTextSubject = new Subject<string>();

  constructor(private userService: UserService) {
    this.searchTextSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(text => this.userService.getUserDetailsById(+text))
    ).subscribe(user => {
      if (user) {
        this.userService.updateUserList([user]);
      }
    });
  }

  filterResults(text: string) {
    this.searchTextSubject.next(text);
  }
}
