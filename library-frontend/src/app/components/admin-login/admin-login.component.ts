import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  template: `
    <div class="login-container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-md-8">
          <div class="card shadow-lg">
            <div class="card-body p-0">
              <div class="row g-0">
                <div class="col-md-6 d-none d-md-block">
                  <div class="library-image-container">
                    <div class="library-bg">
                      <div class="overlay">
                        <h2 class="text-white">Admin Portal</h2>
                        <p class="text-white">Manage library facilities and bookings</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="p-5">
                    <div class="text-center mb-4">
                      <div class="admin-logo mb-3">
                        <i class="fas fa-user-shield fa-3x text-primary"></i>
                      </div>
                      <h2 class="card-title">Admin Login</h2>
                      <p class="text-muted">Please enter your credentials</p>
                    </div>
                    
                    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                      <div class="mb-3">
                        <label for="mobile" class="form-label">Mobile Number</label>
                        <div class="input-group">
                          <span class="input-group-text"><i class="fas fa-mobile-alt"></i></span>
                          <input 
                            type="tel" 
                            class="form-control" 
                            id="mobile" 
                            formControlName="mobile"
                            placeholder="Enter mobile number"
                            [ngClass]="{'is-invalid': submitted && f['mobile'].errors}"
                          >
                        </div>
                        <div *ngIf="submitted && f['mobile'].errors" class="invalid-feedback">
                          <div *ngIf="f['mobile'].errors['required']">Mobile number is required</div>
                          <div *ngIf="f['mobile'].errors['pattern']">Please enter a valid mobile number</div>
                        </div>
                      </div>

                      <div class="mb-4">
                        <label for="password" class="form-label">Password</label>
                        <div class="input-group">
                          <span class="input-group-text"><i class="fas fa-lock"></i></span>
                          <input 
                            type="password" 
                            class="form-control" 
                            id="password" 
                            formControlName="password"
                            placeholder="Enter password"
                            [ngClass]="{'is-invalid': submitted && f['password'].errors}"
                          >
                        </div>
                        <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
                          <div *ngIf="f['password'].errors['required']">Password is required</div>
                          <div *ngIf="f['password'].errors['minlength']">Password must be at least 6 characters</div>
                        </div>
                      </div>

                      <div class="d-grid gap-3">
                        <button type="submit" class="btn btn-primary btn-lg">
                          <i class="fas fa-sign-in-alt me-2"></i> Login
                        </button>
                        <button type="button" class="btn btn-outline-secondary" (click)="goBack()">
                          <i class="fas fa-arrow-left me-2"></i> Back to Login
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                  url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
    }
    .library-image-container {
      position: relative;
      height: 100%;
      min-height: 500px;
      overflow: hidden;
    }
    .library-bg {
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
                  url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
      background-size: cover;
      background-position: center;
    }
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      text-align: center;
    }
    .admin-logo {
      display: inline-block;
      padding: 1rem;
      border-radius: 50%;
      background-color: rgba(78, 115, 223, 0.1);
    }
    .card {
      border: none;
      border-radius: 10px;
      background-color: rgba(255, 255, 255, 0.95);
    }
    .btn {
      border-radius: 5px;
      padding: 0.75rem 1.5rem;
    }
    .btn-primary {
      background-color: #4e73df;
      border-color: #4e73df;
    }
    .btn-primary:hover {
      background-color: #2e59d9;
      border-color: #2653d4;
    }
    .btn-outline-secondary {
      color: #6c757d;
      border-color: #6c757d;
    }
    .btn-outline-secondary:hover {
      background-color: #6c757d;
      color: white;
    }
    .input-group-text {
      background-color: #f8f9fa;
      border-right: none;
    }
    .input-group .form-control {
      border-left: none;
    }
    .input-group .form-control:focus {
      border-color: #ced4da;
      box-shadow: none;
    }
    .input-group:focus-within {
      box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
      border-radius: 0.25rem;
    }
    .input-group:focus-within .input-group-text,
    .input-group:focus-within .form-control {
      border-color: #4e73df;
    }
  `]
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loginError = false;

  // Default admin credentials
  private readonly DEFAULT_ADMIN_MOBILE = '9430816015';
  private readonly DEFAULT_ADMIN_PASSWORD = 'singh1234';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.loginError = false;

    if (this.loginForm.invalid) {
      return;
    }

    const { mobile, password } = this.loginForm.value;

    // Check against default credentials
    if (mobile === this.DEFAULT_ADMIN_MOBILE && password === this.DEFAULT_ADMIN_PASSWORD) {
      // Successful login - navigate to admin dashboard
      this.router.navigate(['/admin-dashboard']);
    } else {
      // Failed login
      this.loginError = true;
      alert('Invalid credentials. Please try again.');
    }
  }

  goBack() {
    this.router.navigate(['/login']);
  }
} 