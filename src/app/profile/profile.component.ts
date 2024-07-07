import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue.user;

    // Redirect to sign-in if no user is logged in
    if (!this.currentUser) {
      this.router.navigate(['/signin']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
