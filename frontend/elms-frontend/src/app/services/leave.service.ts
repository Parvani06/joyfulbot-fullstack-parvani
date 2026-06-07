import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { LeaveType, LeaveApplication, LeaveBalance, LeaveApplicationRequest, ReviewLeaveRequest } from '../models/leave.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLeaveTypes(): Observable<ApiResponse<LeaveType[]>> {
    var url = this.apiUrl + '/leave-types';
    return this.http.get<ApiResponse<LeaveType[]>>(url);
  }

  getMyApplications(): Observable<ApiResponse<LeaveApplication[]>> {
    var url = this.apiUrl + '/leave-applications/my';
    return this.http.get<ApiResponse<LeaveApplication[]>>(url);
  }

  getAllApplications(): Observable<ApiResponse<LeaveApplication[]>> {
    var url = this.apiUrl + '/leave-applications';
    return this.http.get<ApiResponse<LeaveApplication[]>>(url);
  }

  applyLeave(request: LeaveApplicationRequest): Observable<ApiResponse<LeaveApplication>> {
    var url = this.apiUrl + '/leave-applications';
    return this.http.post<ApiResponse<LeaveApplication>>(url, request);
  }

  reviewLeave(id: number, request: ReviewLeaveRequest): Observable<ApiResponse<LeaveApplication>> {
    var url = this.apiUrl + '/leave-applications/' + id + '/review';
    return this.http.put<ApiResponse<LeaveApplication>>(url, request);
  }

  getMyBalances(year: number): Observable<ApiResponse<LeaveBalance[]>> {
    var url = this.apiUrl + '/leave-balances/my?year=' + year;
    return this.http.get<ApiResponse<LeaveBalance[]>>(url);
  }

  getBalancesByUserId(userId: number, year: number): Observable<ApiResponse<LeaveBalance[]>> {
    var url = this.apiUrl + '/leave-balances/user/' + userId + '?year=' + year;
    return this.http.get<ApiResponse<LeaveBalance[]>>(url);
  }

  cancelLeave(id: number): Observable<any> {
    var url = this.apiUrl + '/leave-applications/' + id;
    return this.http.delete<any>(url);
  }
}
