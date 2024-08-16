import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap  } from 'rxjs/operators';

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
    .pipe(map(response => response));
  }
  
  login(email: string, password: string) {
    return this.http.post<any>(`${this.api}/auth/signin`, { email, password }).pipe(
        tap((response: any) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('access_token', response.token);
        this.currentUserSubject.next(response.user);
      }),
      catchError(this.handleError('signin', []))
    );
  }

  logout(): void {
    this.http.post<any>(`${this.api}/auth/logout`, {}).subscribe(() => {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('access_token');
      this.currentUserSubject.next(null);
    },
    error => {
      console.error('Error during logout:', error);
    }
  );
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

  // isAuthenticated(): boolean {
  //   return !!localStorage.getItem('access_token');
  // }

  // Handle errors
  private handleError(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      console.error(error);
      return of(result as any);
    };
  }
}
