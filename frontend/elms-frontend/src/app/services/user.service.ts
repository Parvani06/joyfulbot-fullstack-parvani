import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<ApiResponse<User[]>> {
    var url = this.apiUrl + '/users';
    return this.http.get<ApiResponse<User[]>>(url);
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    var url = this.apiUrl + '/users/' + id;
    return this.http.get<ApiResponse<User>>(url);
  }

  getCurrentUser(): Observable<ApiResponse<User>> {
    var url = this.apiUrl + '/users/me';
    return this.http.get<ApiResponse<User>>(url);
  }
}
