import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';

describe('LoginComponent', () => {
  var component: LoginComponent;
  var fixture: ComponentFixture<LoginComponent>;
  var authServiceSpy: any;

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isLoggedIn', 'saveAuth']);
    authServiceSpy.isLoggedIn.and.returnValue(false);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('form should be invalid with invalid email', () => {
    component.loginForm.controls['email'].setValue('notanemail');
    component.loginForm.controls['password'].setValue('password123');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('form should be valid with correct inputs', () => {
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('password123');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should show error message on failed login', () => {
    authServiceSpy.login.and.returnValue(throwError({ error: { message: 'Invalid credentials' } }));
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('password123');
    component.onSubmit();
    expect(component.errorMessage).not.toBe('');
  });
});