import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


import { UserDetails } from '../user-details';

@Component({
  selector: 'app-user-item',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule],
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.css'
})
export class UserItemComponent {
  
  @Input() userDetails!:UserDetails;

  constructor(private router: Router, private route: ActivatedRoute) {}

  navigateToDetails(userId: number) {
    this.router.navigate(['/details', userId], { relativeTo: this.route });
}

}
