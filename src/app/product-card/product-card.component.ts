import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { RouterLink } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;
  isFavorite: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private dataService: DataService) {}

  ngOnInit() {
    this.isFavorite = this.checkIfFavorite();
  }

  toggleFavorite(id: string) {
    if (this.isFavorite) {
      this.authService.removeFromFavorites(id).pipe(
        catchError(error => {
          this.handleError(error);
          return of(null);
        })
      ).subscribe({
        next: () => {
          this.isFavorite = false;
        }
      });
    } else {
      this.authService.addToFavorites(id).pipe(
        catchError(error => {
          this.handleError(error);
          return of(null);
        })
      ).subscribe({
        next: () => {
          this.isFavorite = true;
        }
      });
    }
  }

  checkIfFavorite(): boolean {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.favorites) {
      return currentUser.favorites.includes(this.product._id);
    }
    return false;
  }

  transferProduct(product: any) {
    this.dataService.setProduct(product);
  }

  private handleError(error: any) {
    if (error) {
      this.errorMessage = error.message;
      console.error('Error:', error);
    } else {
      this.errorMessage = 'An unknown error occurred.';
    }
  }
}
