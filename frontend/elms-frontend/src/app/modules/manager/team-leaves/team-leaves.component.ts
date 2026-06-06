import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ManagerService } from '../../../services/manager.service';

@Component({
  selector: 'app-team-leaves',
  templateUrl: './team-leaves.component.html',
  styleUrls: ['./team-leaves.component.scss']
})
export class TeamLeavesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  allLeaves: any[] = [];
  filteredLeaves: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  selectedStatus: string = 'ALL';
  statusOptions: string[] = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

  editingRemarksId: number = null;
  editingRemarks: string = '';
  editingAction: string = '';

  constructor(private managerService: ManagerService) {}

  ngOnInit() {
    this.loadTeamLeaves();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTeamLeaves() {
    this.loading = true;
    this.errorMessage = '';
    this.managerService.getTeamLeaves(0, 100).subscribe(
      response => {
        if (response.success) {
          this.allLeaves = response.data.content;
          this.dataSource.data = this.allLeaves;
          this.applyFilter();
        }
        this.loading = false;
      },
      error => {
        this.errorMessage = 'Failed to load team leaves.';
        this.loading = false;
      }
    );
  }

  applyFilter() {
    if (this.selectedStatus === 'ALL') {
      this.filteredLeaves = this.allLeaves;
    } else {
      this.filteredLeaves = this.allLeaves.filter(
        leave => leave.status === this.selectedStatus
      );
    }
    this.dataSource.data = this.filteredLeaves;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onStatusFilterChange() {
    this.applyFilter();
  }

  showRemarks(id: number, action: string) {
    this.editingRemarksId = id;
    this.editingRemarks = '';
    this.editingAction = action;
  }

  cancelRemarks() {
    this.editingRemarksId = null;
    this.editingRemarks = '';
    this.editingAction = '';
  }

  confirmAction(id: number) {
    if (this.editingAction === 'APPROVE') {
      this.approveLeave(id);
    } else {
      this.rejectLeave(id);
    }
  }

  approveLeave(id: number) {
    var remarks = this.editingRemarks || 'Approved';
    this.managerService.approveLeave(id, remarks).subscribe(
      response => {
        if (response.success) {
          this.successMessage = 'Leave approved successfully.';
          this.cancelRemarks();
          this.loadTeamLeaves();
        }
      },
      error => { this.errorMessage = 'Failed to approve leave.'; }
    );
  }

  rejectLeave(id: number) {
    var remarks = this.editingRemarks || 'Rejected';
    this.managerService.rejectLeave(id, remarks).subscribe(
      response => {
        if (response.success) {
          this.successMessage = 'Leave rejected successfully.';
          this.cancelRemarks();
          this.loadTeamLeaves();
        }
      },
      error => { this.errorMessage = 'Failed to reject leave.'; }
    );
  }
}
