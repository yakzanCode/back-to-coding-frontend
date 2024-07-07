import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../services/data.service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  similarProducts: Product[] = [];
  productsToShow = 4;
  
  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        const product = this.dataService.getProduct();
        if (product && product._id === productId) {
          this.product = product;
        } else {
          console.error('Product not found in local storage');
        }
      }
    });
  }

  fetchSimilarProducts(type: string) {
    this.dataService.getSimilarProducts(type)
    .subscribe((data: Product[]) => {
      this.similarProducts = data.filter(p => p._id !== this.product!._id);
    })
  }

  showMoreProducts() {
    this.productsToShow += 4;
  }

  // ngOnDestroy(): void {
  //   this.dataService.clearProduct();
  // }
}
