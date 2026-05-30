import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { LeaveService } from '../../../services/leave.service';
import { LeaveApplication } from '../../../models/leave.model';

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss']
})
export class LeaveListComponent implements OnInit {
  applications: LeaveApplication[] = [];
  isManager: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private leaveService: LeaveService
  ) {}

  ngOnInit() {
    this.isManager = this.authService.isManager();
    this.loadApplications();
  }

  loadApplications() {
    this.loading = true;
    if (this.isManager) {
      this.leaveService.getAllApplications().subscribe(
        response => {
          if (response.success) {
            this.applications = response.data;
          }
          this.loading = false;
        },
        error => {
          this.errorMessage = 'Failed to load applications.';
          this.loading = false;
        }
      );
    } else {
      this.leaveService.getMyApplications().subscribe(
        response => {
          if (response.success) {
            this.applications = response.data;
          }
          this.loading = false;
        },
        error => {
          this.errorMessage = 'Failed to load applications.';
          this.loading = false;
        }
      );
    }
  }

  reviewLeave(id: number, status: string) {
    var request = { status: status as 'APPROVED' | 'REJECTED', remarks: status === 'APPROVED' ? 'Approved.' : 'Rejected.' };
    this.leaveService.reviewLeave(id, request).subscribe(
      response => {
        if (response.success) {
          this.successMessage = 'Application ' + status.toLowerCase() + ' successfully.';
          this.loadApplications();
        }
      },
      error => {
        this.errorMessage = 'Failed to review application.';
      }
    );
  }

  cancelLeave(id: number) {
    this.leaveService.cancelLeave(id).subscribe(
      response => {
        if (response.success) {
          this.successMessage = 'Leave application cancelled successfully.';
          this.loadApplications();
        }
      },
      error => {
        this.errorMessage = 'Failed to cancel application.';
      }
    );
  }
}