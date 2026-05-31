import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponse } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.get(AuthService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login() should POST to /auth/login and return token', () => {
    const mockResponse: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        token: 'test-token',
        email: 'test@test.com',
        name: 'Test',
        role: 'EMPLOYEE'
      },
      message: ''
    };

    service.login('test@test.com', 'password123').subscribe(response => {
      expect(response.data.token).toBe('test-token');
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(req => req.url.includes('/auth/login'));
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('isLoggedIn() should return false when no token in localStorage', () => {
    localStorage.clear();
    const result = service.isLoggedIn();
    expect(result).toBeFalsy();
  });

  it('isLoggedIn() should return true after saveAuth called', () => {
    const mockAuthResponse: AuthResponse = {
      token: 'test-token',
      email: 'test@test.com',
      name: 'Test User',
      role: 'EMPLOYEE'
    };

    service.saveAuth(mockAuthResponse);
    const result = service.isLoggedIn();
    expect(result).toBeTruthy();
  });

  it('logout() should clear localStorage', () => {
    const mockAuthResponse: AuthResponse = {
      token: 'test-token',
      email: 'test@test.com',
      name: 'Test User',
      role: 'EMPLOYEE'
    };

    service.saveAuth(mockAuthResponse);
    expect(localStorage.getItem('token')).toBe('test-token');

    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
