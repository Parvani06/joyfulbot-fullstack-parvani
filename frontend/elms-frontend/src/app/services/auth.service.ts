import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(this.apiUrl + '/auth/login', {
      email: email,
      password: password
    });
  }

  register(request: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/auth/register', request);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string {
    var token = localStorage.getItem('token');
    return token ? token : '';
  }

  getCurrentUser(): any {
    var userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== '';
  }

  isManager(): boolean {
    var user = this.getCurrentUser();
    if (user && user.role) {
      return user.role === 'MANAGER';
    }
    return false;
  }

  saveAuth(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify({
      email: authResponse.email,
      name: authResponse.name,
      role: authResponse.role
    }));
    this.currentUserSubject.next({ email: authResponse.email, name: authResponse.name, role: authResponse.role });
  }
}