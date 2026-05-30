import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  departments: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['EMPLOYEE', Validators.required],
      departmentId: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.loadDepartments();
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors {
    var group = control as FormGroup;
    if (!group) return null;
    var password = group.get('password');
    var confirmPassword = group.get('confirmPassword');
    if (!password || !confirmPassword) return null;
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword.errors && confirmPassword.errors.passwordMismatch) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  loadDepartments() {
    var url = environment.apiUrl + '/departments';
    this.http.get<any>(url).subscribe(
      response => {
        if (response.success) {
          this.departments = response.data;
        }
      },
      error => {
        console.error('Failed to load departments', error);
      }
    );
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    var formValue = this.registerForm.value;
    var request = {
      name: formValue.name,
      email: formValue.email,
      password: formValue.password,
      role: formValue.role,
      departmentId: formValue.departmentId
    };
    this.authService.register(request).subscribe(
      response => {
        if (response.success) {
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => { this.router.navigate(['/login']); }, 1500);
        } else {
          this.errorMessage = response.message;
          this.loading = false;
        }
      },
      error => {
        this.errorMessage = 'Registration failed. Please try again.';
        this.loading = false;
      }
    );
  }
}
