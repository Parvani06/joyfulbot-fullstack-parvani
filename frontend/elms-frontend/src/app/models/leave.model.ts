export interface LeaveType {
  id: number;
  name: string;
  maxDaysPerYear: number;
  description: string;
}

export interface LeaveApplication {
  id: number;
  employeeName: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
  reviewedAt: string;
  remarks: string;
}

export interface LeaveBalance {
  id: number;
  leaveTypeName: string;
  year: number;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

export interface LeaveApplicationRequest {
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface ReviewLeaveRequest {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  remarks: string;
}
