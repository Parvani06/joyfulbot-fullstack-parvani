import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveService } from '../../../services/leave.service';
import { LeaveType } from '../../../models/leave.model';

@Component({
  selector: 'app-leave-apply',
  templateUrl: './leave-apply.component.html',
  styleUrls: ['./leave-apply.component.scss']
})
export class LeaveApplyComponent implements OnInit {
  applyForm: FormGroup;
  leaveTypes: LeaveType[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit() {
    this.applyForm = this.fb.group({
      leaveTypeId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      totalDays: [''],
      reason: ['', Validators.required]
    });

    this.leaveService.getLeaveTypes().subscribe(
      response => {
        if (response.success) {
          this.leaveTypes = response.data;
        }
      },
      error => { console.error(error); }
    );

    var startDateControl = this.applyForm.get('startDate');
    var endDateControl = this.applyForm.get('endDate');
    
    if (startDateControl) {
      startDateControl.valueChanges.subscribe(() => {
        this.calculateTotalDays();
      });
    }
    
    if (endDateControl) {
      endDateControl.valueChanges.subscribe(() => {
        this.calculateTotalDays();
      });
    }
  }

  calculateTotalDays() {
    var startDate = this.applyForm.get('startDate').value;
    var endDate = this.applyForm.get('endDate').value;
    if (startDate && endDate) {
      var start = new Date(startDate);
      var end = new Date(endDate);
      var diffTime = Math.abs(end.getTime() - start.getTime());
      var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      this.applyForm.get('totalDays').setValue(diffDays);
    }
  }

  onSubmit() {
    if (this.applyForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    var formValue = this.applyForm.value;
    var request = {
      leaveTypeId: formValue.leaveTypeId,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      reason: formValue.reason
    };
    this.leaveService.applyLeave(request).subscribe(
      response => {
        if (response.success) {
          this.successMessage = 'Leave application submitted successfully!';
          setTimeout(() => { this.router.navigate(['/leaves']); }, 1500);
        } else {
          this.errorMessage = response.message;
          this.loading = false;
        }
      },
      error => {
        this.errorMessage = 'Failed to submit application. Please try again.';
        this.loading = false;
      }
    );
  }
}