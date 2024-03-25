import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { UserDetails } from '../user-details';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';

export const popupAnimation = trigger('popupAnimation', [
  transition(':enter', [
    style({ transform: 'scale(0.5)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'scale(0.5)', opacity: 0 }))
  ])
]);

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
  animations: [popupAnimation]
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  userService = inject(UserService);
  userDetails: UserDetails | undefined;
  constructor(private location: Location) {
    const userId = parseInt(this.route.snapshot.params['id']);
    this.userService.getUserDetailsById(userId).then((userDetails) => {
      this.userDetails = userDetails;
    });
  }
  goBack(): void {
    this.location.back();
  }
}
