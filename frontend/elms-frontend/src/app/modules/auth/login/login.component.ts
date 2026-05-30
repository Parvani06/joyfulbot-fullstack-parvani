import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    var email = this.loginForm.value.email;
    var password = this.loginForm.value.password;
    this.authService.login(email, password).subscribe(
      response => {
        if (response.success) {
          this.authService.saveAuth(response.data);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message;
          this.loading = false;
        }
      },
      error => {
        this.errorMessage = 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    );
  }
}