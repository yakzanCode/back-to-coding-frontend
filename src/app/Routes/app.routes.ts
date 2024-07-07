import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { AuthGuard } from '../services/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'product/:id', loadComponent: () => import ('../product-details/product-details.component').then((c) => c.ProductDetailsComponent) },
    { path: 'signin', loadComponent: () => import ('../signin/signin.component').then((c) => c.SigninComponent) },
    { path: 'signup', loadComponent: () => import ('../signup/signup.component').then((c) => c.SignupComponent) },
    { path: 'profile', loadComponent: () => import('../profile/profile.component').then(m => m.ProfileComponent), canActivate: [AuthGuard] },
    { path: 'favorites', loadComponent: () => import ('../products-list/products-list.component').then(m => m.ProductsListComponent), canActivate: [AuthGuard] },
    { path: ':brand', loadComponent: () => import ('../products-list/products-list.component').then((c) => c.ProductsListComponent) },
    { path: ':brand/:category', loadComponent: () => import ('../products-list/products-list.component').then((c) => c.ProductsListComponent) },
    { path: ':brand/:category/:type', loadComponent: () => import ('../products-list/products-list.component').then((c) => c.ProductsListComponent) },
];
