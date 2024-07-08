import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DataService } from '../services/data.service';
import { ProductsListComponent } from '../products-list/products-list.component';
import { Product } from '../models/product.model';
import { SlickCarouselModule } from 'ngx-slick-carousel';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductsListComponent, SlickCarouselModule, RouterLink ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  Products: Product[] = [];
  featuredProducts: Product[] = [];
  brands: Set<string> = new Set();


  constructor( private dataService: DataService){}

  ngOnInit() {
    this.fetchProducts();
  }

  slideConfig = {
      'slidesToShow': 4,
      'slidesToScroll': 4,
      'centerMode': true,
      'centerPadding': '50px',
      'dots': true,
      "arrows" : true,
      'responsive': [
        {
          breakpoint: 868,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        }
      ]
    }

  fetchProducts(){
    this.dataService.getProducts()
    .subscribe((products: Product[])=>{
      this.Products = products;
      this.filterFeaturedProducts();
    });
  }

  filterFeaturedProducts(): void {
    this.featuredProducts = this.Products.filter(product => product.featured);
  }

  transferProduct(product: any) {
    this.dataService.setProduct(product);
  }

}
