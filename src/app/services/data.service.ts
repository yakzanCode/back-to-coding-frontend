import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private api = 'http://localhost:3000/api';
  private localStorageKey = 'selectedProduct';

  constructor(private http: HttpClient) { }
  
  getProducts() {
    return this.http.get<Product[]>(`${this.api}/products`);
  };

  getSimilarProducts(type: Product["type"]) {
    return this.http.get<Product[]>(`${this.api}/products/similar/${type}`);
  };

  setProduct(product: Product): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(product));
  }

  getProduct(): Product | null {
    const productJson = localStorage.getItem(this.localStorageKey);
    return productJson ? JSON.parse(productJson) : null;
  }

  clearProduct(): void {
    localStorage.removeItem(this.localStorageKey);
  }

}
