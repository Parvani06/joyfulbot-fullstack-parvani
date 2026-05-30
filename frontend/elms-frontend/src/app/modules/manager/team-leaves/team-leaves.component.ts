import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../../../services/manager.service';

@Component({
  selector: 'app-team-leaves',
  templateUrl: './team-leaves.component.html',
  styleUrls: ['./team-leaves.component.scss']
})
export class TeamLeavesComponent implements OnInit {
  leaves: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  currentPage: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  
  selectedStatus: string = 'ALL';
  statusFilter: string[] = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];
  
  editingRemarksId: number = null;
  editingRemarks: string = '';

  constructor(private managerService: ManagerService) {}

  ngOnInit() {
    this.loadTeamLeaves();
  }

  loadTeamLeaves() {
    this.loading = true;
    this.errorMessage = '';
    var pageIndex = this.currentPage - 1;
    this.managerService.getTeamLeaves(pageIndex, this.pageSize).subscribe(
      response => {
        if (response.success) {
          this.leaves = response.data.content;
          this.totalElements = response.data.totalElements;
        }
        this.loading = false;
      },
      error => {
        this.errorMessage = 'Failed to load team leaves.';
        this.loading = false;
      }
    );
  }

  onStatusFilterChange() {
    this.currentPage = 1;
    this.loadTeamLeaves();
  }

  showApproveRemarks(id: number) {
    this.editingRemarksId = id;
    this.editingRemarks = '';
  }

  showRejectRemarks(id: number) {
    this.editingRemarksId = id;
    this.editingRemarks = '';
  }

  cancelRemarks() {
    this.editingRemarksId = null;
    this.editingRemarks = '';
  }

  approveLeave(id: number) {
    var remarks = this.editingRemarks || 'Approved';
    this.managerService.approveLeave(id, remarks).subscribe(
      response => {
        if (response.success) {
          this.successMessage = 'Leave approved successfully.';
          this.editingRemarksId = null;
          this.editingRemarks = '';
          this.loadTeamLeaves();
        }
      },
      error => {
        this.errorMessage = 'Failed to approve leave.';
      }
    );
  }

  rejectLeave(id: number) {
    var remarks = this.editingRemarks || 'Rejected';
    this.managerService.rejectLeave(id, remarks).subscribe(
      response => {
        if (response.success) {
          this.successMessage = 'Leave rejected successfully.';
          this.editingRemarksId = null;
          this.editingRemarks = '';
          this.loadTeamLeaves();
        }
      },
      error => {
        this.errorMessage = 'Failed to reject leave.';
      }
    );
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTeamLeaves();
    }
  }

  nextPage() {
    var maxPage = Math.ceil(this.totalElements / this.pageSize);
    if (this.currentPage < maxPage) {
      this.currentPage++;
      this.loadTeamLeaves();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadTeamLeaves();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  getPageNumbers(): number[] {
    var totalPages = this.getTotalPages();
    var pages = [];
    for (var i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
