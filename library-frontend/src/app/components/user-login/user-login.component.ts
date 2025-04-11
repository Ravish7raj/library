import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  template: `
    <div class="login-container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title text-center mb-4">User Login</h3>
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="mobile" class="form-label">Mobile Number</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    id="mobile" 
                    formControlName="mobile"
                    placeholder="Enter mobile number"
                    [ngClass]="{'is-invalid': submitted && f['mobile'].errors}"
                  >
                  <div *ngIf="submitted && f['mobile'].errors" class="invalid-feedback">
                    <div *ngIf="f['mobile'].errors['required']">Mobile number is required</div>
                    <div *ngIf="f['mobile'].errors['pattern']">Please enter a valid mobile number</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="dob" class="form-label">Date of Birth</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="dob" 
                    formControlName="dob"
                    [ngClass]="{'is-invalid': submitted && f['dob'].errors}"
                  >
                  <div *ngIf="submitted && f['dob'].errors" class="invalid-feedback">
                    <div *ngIf="f['dob'].errors['required']">Date of birth is required</div>
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary">Login</button>
                  <button type="button" class="btn btn-link" (click)="goBack()">Back to Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      margin-top: 50px;
    }
    .card {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class UserLoginComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dob: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    // Here you would typically make an API call to verify the credentials
    console.log('User login attempt:', this.loginForm.value);
    // For now, we'll just show an alert
    alert('Login successful!');
  }

  goBack() {
    this.router.navigate(['/login']);
  }
} 