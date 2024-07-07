import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Product } from '../models/product.model';
import { DataService } from '../services/data.service';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-my-navbar',
  standalone: true,
  imports: [CommonModule, SideBarComponent, RouterLink],
  templateUrl: './my-navbar.component.html',
  styleUrl: './my-navbar.component.css'
})
export class MyNavbarComponent {
  categories: Set<string> = new Set();
  brands: Set<string> = new Set();
  Products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor( private dataservice: DataService, private router: Router, private authService: AuthService, private location: Location ){}

  ngOnInit() {
    this.fetchProducts();
  }

  goBack(): void {
    this.location.back();
  }  

  navigateToCategory(category: string) {
    this.router.navigate(['/products', category]);
  }

  navigateToProfile() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/signin']);
    }
  }

  fetchProducts(){
    this.dataservice.getProducts()
    .subscribe((data)=>{
      this.Products = data;
      data.forEach(product => {
        this.extractCategories(product);
        this.extractBrands(product);
      });
      this.filteredProducts = [...this.Products];
    });
  }


  extractCategories(p:Product) {
      this.categories.add(p.category);
  }

  extractBrands(p:Product) {
    this.brands.add(p.brand);
}

}
