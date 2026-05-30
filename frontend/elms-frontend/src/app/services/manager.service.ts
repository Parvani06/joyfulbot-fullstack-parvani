import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTeamLeaves(page: number, size: number): Observable<any> {
    var url = this.apiUrl + '/manager/team-leaves?page=' + page + '&size=' + size;
    return this.http.get<any>(url);
  }

  getAnalytics(): Observable<any> {
    var url = this.apiUrl + '/manager/analytics';
    return this.http.get<any>(url);
  }

  approveLeave(id: number, remarks: string): Observable<any> {
    var url = this.apiUrl + '/leave-applications/' + id + '/review';
    var body = { status: 'APPROVED', remarks: remarks };
    return this.http.put<any>(url, body);
  }

  rejectLeave(id: number, remarks: string): Observable<any> {
    var url = this.apiUrl + '/leave-applications/' + id + '/review';
    var body = { status: 'REJECTED', remarks: remarks };
    return this.http.put<any>(url, body);
  }

  cancelLeave(id: number): Observable<any> {
    var url = this.apiUrl + '/leave-applications/' + id;
    return this.http.delete<any>(url);
  }
}
