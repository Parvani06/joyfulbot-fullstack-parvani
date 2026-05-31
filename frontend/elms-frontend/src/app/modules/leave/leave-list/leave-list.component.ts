import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../services/auth.service';
import { LeaveService } from '../../../services/leave.service';
import { LeaveApplication } from '../../../models/leave.model';

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss']
})
export class LeaveListComponent implements OnInit, AfterViewInit {
  applications: LeaveApplication[] = [];
  dataSource = new MatTableDataSource<LeaveApplication>([]);
  displayedColumns: string[] = [];
  isManager: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  filterValue: string = '';

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private leaveService: LeaveService
  ) {}

  ngOnInit() {
    this.isManager = this.authService.isManager();
    this.displayedColumns = this.isManager
      ? ['employeeName', 'leaveTypeName', 'startDate', 'endDate', 'totalDays', 'reason', 'status', 'actions']
      : ['leaveTypeName', 'startDate', 'endDate', 'totalDays', 'reason', 'status', 'actions'];

    this.dataSource.filterPredicate = (data: LeaveApplication, filter: string) => {
      const dataStr = (
        (data.employeeName || '') +
        data.leaveTypeName +
        data.startDate +
        data.endDate +
        data.totalDays +
        data.reason +
        data.status
      ).toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    };

    this.loadApplications();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;
  }

  loadApplications() {
    this.loading = true;
    this.errorMessage = '';

    const successHandler = (response: any) => {
      if (response.success) {
        this.applications = response.data;
        this.dataSource.data = this.applications;
      }
      this.loading = false;
    };

    const errorHandler = () => {
      this.errorMessage = 'Failed to load applications.';
      this.loading = false;
    };

    if (this.isManager) {
      this.leaveService.getAllApplications().subscribe(successHandler, errorHandler);
    } else {
      this.leaveService.getMyApplications().subscribe(successHandler, errorHandler);
    }
  }

  reviewLeave(id: number, status: string) {
    const request = { status: status as 'APPROVED' | 'REJECTED', remarks: status === 'APPROVED' ? 'Approved.' : 'Rejected.' };
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
