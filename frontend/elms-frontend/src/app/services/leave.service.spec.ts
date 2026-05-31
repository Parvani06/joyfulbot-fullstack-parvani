import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LeaveService } from './leave.service';
import { ApiResponse } from '../models/api-response.model';
import { LeaveType, LeaveApplication, LeaveApplicationRequest } from '../models/leave.model';

describe('LeaveService', () => {
  let service: LeaveService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LeaveService]
    });
    service = TestBed.get(LeaveService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getMyApplications() should GET /leave-applications/my', () => {
    const mockResponse: ApiResponse<LeaveApplication[]> = {
      success: true,
      data: [],
      message: ''
    };

    service.getMyApplications().subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data).toEqual([]);
    });

    const req = httpMock.expectOne(req => req.url.includes('/leave-applications/my'));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getLeaveTypes() should GET /leave-types', () => {
    const mockResponse: ApiResponse<LeaveType[]> = {
      success: true,
      data: [],
      message: ''
    };

    service.getLeaveTypes().subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data).toEqual([]);
    });

    const req = httpMock.expectOne(req => req.url.includes('/leave-types'));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('applyLeave() should POST to /leave-applications', () => {
    const mockRequest: LeaveApplicationRequest = {
      leaveTypeId: 1,
      startDate: '2026-08-01',
      endDate: '2026-08-03',
      reason: 'Test'
    };

    const mockResponse: ApiResponse<LeaveApplication> = {
      success: true,
      data: {} as LeaveApplication,
      message: ''
    };

    service.applyLeave(mockRequest).subscribe(response => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(req => req.url.includes('/leave-applications'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });
});
