import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  email: string = '';
  fullname: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  signup() {
    this.authService.signup(this.email, this.password, this.fullname)
    .subscribe(response => {
      console.log('Signup successful', response);
      this.router.navigate(['/profile']);
    }, error => {
      console.error('Signup error', error);
    });
  }

}
