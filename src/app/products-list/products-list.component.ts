import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../models/product.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, RouterLink],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {
  
  Products: Product[] = [];
  filteredProducts: Product[] = [];
  favoriteProducts: Product[] = [];
  favoriteProductsIds: string[] = [];

  currentCategory: string = "";
  currentBrand: string = "";
  currentType: string = "";

  types: Set<string> = new Set();
  categories: Set<string> = new Set();

  constructor( private dataservice: DataService, private route: ActivatedRoute, private authService: AuthService ) { }

  ngOnInit() {
    this.favoriteProductsIds = this.authService.currentUserValue?.user.favorites;
    this.checkRouteForFavorites()
    console.log(this.favoriteProductsIds);
    
  }


  fetchProducts() {
    return this.dataservice.getProducts();
  }

  filterFavoriteProducts() {
    this.favoriteProducts = this.Products.filter(product => this.favoriteProductsIds.includes(product._id));
    this.filteredProducts = [...this.favoriteProducts];
  }

  checkRouteForFavorites() {
    this.route.url.subscribe(urlSegments => {
      if (urlSegments.some(segment => segment.path === 'favorites')) {
        this.fetchProducts().subscribe(products => {
          this.Products = products;
          this.filterFavoriteProducts();
        });
      } else {
        this.readRoutes();
      }
    });
  }

  readRoutes( ) {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.currentBrand = params.get('brand') || '';
        this.currentCategory = params.get('category') || '';
        this.currentType = params.get('type') || '';
        return this.fetchProducts();
      })
    ).subscribe(data => {
      this.Products = data;
      this.applyFilters();
    });
  }

  // ngOnInit() {
  //   this.getRoute();
  //   this.fetchProducts();
  // }

  // getRoute() {
  //   this.route.paramMap.subscribe(params => {
  //     this.currentBrand = params.get('brand') || '';
  //     this.currentCategory = params.get('category') || '';
  //     this.currentType = params.get('type') || '';
  //   })
  // };


  // fetchProducts() {
  //   this.dataservice.getProducts()
  //     .subscribe((data: Product[]) => {
  //       this.Products = data;
  //       this.applyFilters();
  //     });
  // }

  applyFilters() {
    if (this.currentType) {
      this.filterProductsByType();
    } else if (this.currentCategory) {
      this.filterProductsByCategory();
    } else if (this.currentBrand) {
      this.filterProductsByBrand();
    } else {
      this.filteredProducts = [...this.Products];
    }
  }



  filterProductsByBrand() {
    this.categories.clear();
    if (this.currentBrand && this.currentBrand !== 'All') {
      this.filteredProducts = this.Products.filter(product => product.brand === this.currentBrand);
    } else {
      this.filteredProducts = [...this.Products];
    }
    this.extractCategories();
  }

  filterProductsByCategory() {
    this.types.clear();
    if (this.currentCategory) {
      this.filteredProducts = this.Products.filter(product => product.category === this.currentCategory);

    } else {
      this.filteredProducts = [...this.Products];
    }
    this.extractTypes();
  }

  filterProductsByType() {
    if (this.currentType) {
      this.filteredProducts = this.Products.filter(product => product.type === this.currentType);

    } else {
      this.filteredProducts = [...this.Products];
    }
  }

  extractTypes() {
    this.filteredProducts.forEach(product => {
      if (product.type) {
        this.types.add(product.type);
      }
    });
  }

  extractCategories() {
    this.filteredProducts.forEach(product => {
      if (product.category) {
        this.categories.add(product.category);
      }
    });
  }

  transferProduct(product: Product) {
    this.dataservice.setProduct(product);
  }

}
