import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <div class="login-header">
        <div class="header-content">
          <h1>Welcome to Library Management System</h1>
          <p>Choose your login type to continue</p>
        </div>
      </div>

      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6">
            <div class="login-options-card">
              <div class="text-center mb-4">
                <div class="logo-icon">
                  <i class="fas fa-book-reader"></i>
                </div>
                <h2 class="login-title">Login Portal</h2>
                <p class="login-subtitle">Select your role to proceed</p>
              </div>

              <div class="d-grid gap-3">
                <button class="btn btn-primary btn-lg login-btn student-btn" (click)="goToStudentLogin()">
                  <i class="fas fa-user-graduate me-2"></i>
                  Student Login
                </button>
                <button class="btn btn-secondary btn-lg login-btn admin-btn" (click)="goToAdminLogin()">
                  <i class="fas fa-user-shield me-2"></i>
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      background-color: #f8f9fc;
    }

    .login-header {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                  url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
      background-size: cover;
      background-position: center;
      color: white;
      padding: 4rem 0;
      margin-bottom: 2rem;
      text-align: center;
    }

    .header-content h1 {
      font-size: 2.8rem;
      font-weight: 700;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .header-content p {
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .login-options-card {
      background: white;
      border-radius: 15px;
      padding: 3rem 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .logo-icon {
      width: 100px;
      height: 100px;
      margin: 0 auto 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: rgba(78, 115, 223, 0.1);
      color: #4e73df;
      font-size: 2.5rem;
    }

    .login-title {
      color: #2c3e50;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .login-subtitle {
      color: #7b8a8b;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .login-btn {
      padding: 1rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .student-btn {
      background-color: #4e73df;
      border-color: #4e73df;
    }

    .student-btn:hover {
      background-color: #2e59d9;
      border-color: #2653d4;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(78, 115, 223, 0.2);
    }

    .admin-btn {
      background-color: #858796;
      border-color: #858796;
    }

    .admin-btn:hover {
      background-color: #717384;
      border-color: #6b6d7d;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(133, 135, 150, 0.2);
    }

    @media (max-width: 768px) {
      .login-header {
        padding: 3rem 0;
      }

      .header-content h1 {
        font-size: 2.2rem;
      }

      .login-options-card {
        padding: 2rem 1.5rem;
      }

      .logo-icon {
        width: 80px;
        height: 80px;
        font-size: 2rem;
      }
    }
  `]
})
export class LoginComponent {
  constructor(private router: Router) {}

  goToStudentLogin() {
    this.router.navigate(['/student-login']);
  }

  goToAdminLogin() {
    this.router.navigate(['/admin-login']);
  }
} 