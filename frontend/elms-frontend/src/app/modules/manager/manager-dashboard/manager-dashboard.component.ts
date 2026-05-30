import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ManagerService } from '../../../services/manager.service';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {
  currentUser: any;
  loading: boolean = false;
  analytics: any = {
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalCount: 0
  };

  constructor(
    private authService: AuthService,
    private managerService: ManagerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading = true;
    this.managerService.getAnalytics().subscribe(
      response => {
        if (response.success) {
          this.analytics = response.data;
        }
        this.loading = false;
      },
      error => {
        console.error('Failed to load analytics', error);
        this.loading = false;
      }
    );
  }

  viewTeamLeaves() {
    this.router.navigate(['/manager/team-leaves']);
  }
}
