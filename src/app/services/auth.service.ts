import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'http://localhost:3000/api';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    // Parse the current user from localStorage, providing a fallback value if it is null
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  signup(email: string, password: string, fullname: string) {
    return this.http.post<any>(`${this.api}/auth/signup`, { email, password, fullname })
      .pipe(map(response => {
        return response;
      }));
  }
  
  login(email: string, password: string) {
    return this.http.post<any>(`${this.api}/auth/signin`, { email, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  addToFavorites(productId: string) {
    return this.http.post<any>(`${this.api}/users/favorites/${productId}`, {}).pipe(
      map(response => {
        const currentUser = this.currentUserValue;
          currentUser.favorites.push(productId);
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          this.currentUserSubject.next(currentUser);
        return response;
      })
    );
  }

  removeFromFavorites(productId: string) {
    return this.http.delete<any>(`${this.api}/users/favorites/${productId}`).pipe(
      map(response => {
        const currentUser = this.currentUserValue;
        currentUser.favorites = currentUser.favorites.filter((id: string) => id !== productId);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.currentUserSubject.next(currentUser);
        return response;
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }
}
