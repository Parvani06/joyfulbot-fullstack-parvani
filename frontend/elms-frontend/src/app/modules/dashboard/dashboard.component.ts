import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LeaveService } from '../../services/leave.service';
import { ManagerService } from '../../services/manager.service';
import { LeaveBalance } from '../../models/leave.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  isManager: boolean = false;
  analytics: any = { PENDING: 0, APPROVED: 0, REJECTED: 0, TOTAL: 0 };
  leaveBalances: LeaveBalance[] = [];
  currentYear: number = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private leaveService: LeaveService,
    private managerService: ManagerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.isManager = this.authService.isManager();
    if (this.isManager) {
      this.managerService.getAnalytics().subscribe(
        response => {
          if (response.success) {
            this.analytics = response.data;
          }
        },
        error => { console.error(error); }
      );
    } else {
      this.leaveService.getMyBalances(this.currentYear).subscribe(
        response => {
          if (response.success) {
            this.leaveBalances = response.data;
          }
        },
        error => { console.error(error); }
      );
    }
  }
}
