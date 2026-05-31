import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../../../services/manager.service';

@Component({
  selector: 'app-team-leaves',
  templateUrl: './team-leaves.component.html',
  styleUrls: ['./team-leaves.component.scss']
})
export class TeamLeavesComponent implements OnInit {
  allLeaves: any[] = [];
  filteredLeaves: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  currentPage: number = 1;
  pageSize: number = 10;

  selectedStatus: string = 'ALL';
  statusOptions: string[] = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

  editingRemarksId: number = null;
  editingRemarks: string = '';
  editingAction: string = '';

  constructor(private managerService: ManagerService) {}

  ngOnInit() {
    this.loadTeamLeaves();
  }

  loadTeamLeaves() {
    this.loading = true;
    this.errorMessage = '';
    this.managerService.getTeamLeaves(0, 100).subscribe(
      response => {
        if (response.success) {
          this.allLeaves = response.data.content;
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
    this.currentPage = 1;
  }

  onStatusFilterChange() {
    this.applyFilter();
  }

  getPagedLeaves(): any[] {
    var start = (this.currentPage - 1) * this.pageSize;
    var end = start + this.pageSize;
    return this.filteredLeaves.slice(start, end);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredLeaves.length / this.pageSize);
  }

  getPageNumbers(): number[] {
    var totalPages = this.getTotalPages();
    var pages = [];
    for (var i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
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