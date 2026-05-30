import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LeaveService } from '../../services/leave.service';
import { LeaveBalance } from '../../models/leave.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  isManager: boolean = false;
  leaveBalances: LeaveBalance[] = [];
  currentYear: number = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.isManager = this.authService.isManager();
    if (!this.isManager) {
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