import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="header-content">
          <h1>Library Management System</h1>
          <p>Manage your library facilities efficiently</p>
        </div>
      </div>

      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-12 text-center mb-4">
            <h2 class="dashboard-title">Admin Dashboard</h2>
            <p class="dashboard-subtitle">Select a facility to manage</p>
          </div>
          
          <div class="col-md-6 col-lg-5 mb-4">
            <div class="facility-card non-ac" (click)="goToNonAcFacility()">
              <div class="card-icon">
                <i class="fas fa-fan"></i>
              </div>
              <h3>NON AC Facility</h3>
              <p>Manage non-air conditioned facilities and rooms</p>
              <div class="seats-info">
                <i class="fas fa-chair"></i>
                <span>15 seats available</span>
              </div>
              <div class="card-overlay">
                <button class="btn btn-light">
                  <i class="fas fa-arrow-right"></i> Manage
                </button>
              </div>
            </div>
          </div>
          
          <div class="col-md-6 col-lg-5 mb-4">
            <div class="facility-card ac" (click)="goToAcFacility()">
              <div class="card-icon">
                <i class="fas fa-snowflake"></i>
              </div>
              <h3>AC Facility</h3>
              <p>Manage air conditioned facilities and rooms</p>
              <div class="seats-info">
                <i class="fas fa-chair"></i>
                <span>22 seats available</span>
              </div>
              <div class="card-overlay">
                <button class="btn btn-light">
                  <i class="fas fa-arrow-right"></i> Manage
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-4">
          <button class="btn btn-outline-danger btn-lg logout-btn" (click)="logout()">
            <i class="fas fa-sign-out-alt me-2"></i>Logout
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f8f9fc;
    }

    .dashboard-header {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                  url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
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

    .dashboard-title {
      color: #2c3e50;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .dashboard-subtitle {
      color: #7b8a8b;
      font-size: 1.1rem;
    }

    .facility-card {
      background: white;
      border-radius: 15px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      height: 100%;
    }

    .facility-card:hover {
      transform: translateY(-5px);
    }

    .facility-card:hover .card-overlay {
      opacity: 1;
    }

    .card-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 2rem;
    }

    .non-ac .card-icon {
      background-color: rgba(46, 204, 113, 0.1);
      color: #2ecc71;
    }

    .ac .card-icon {
      background-color: rgba(52, 152, 219, 0.1);
      color: #3498db;
    }

    .facility-card h3 {
      color: #2c3e50;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .facility-card p {
      color: #7b8a8b;
      margin-bottom: 1.5rem;
    }

    .seats-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: #95a5a6;
      font-size: 1.1rem;
    }

    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: all 0.3s ease;
    }

    .card-overlay .btn {
      padding: 0.75rem 2rem;
      font-weight: 600;
      transform: translateY(20px);
      transition: all 0.3s ease;
    }

    .facility-card:hover .card-overlay .btn {
      transform: translateY(0);
    }

    .logout-btn {
      padding: 0.75rem 2.5rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(220, 53, 69, 0.2);
    }

    @media (max-width: 768px) {
      .dashboard-header {
        padding: 3rem 0;
      }

      .header-content h1 {
        font-size: 2.2rem;
      }

      .facility-card {
        padding: 1.5rem;
      }

      .card-icon {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
      }
    }
  `]
})
export class AdminDashboardComponent {
  constructor(private router: Router) {}

  goToAcFacility() {
    this.router.navigate(['/ac-facility']);
  }

  goToNonAcFacility() {
    this.router.navigate(['/non-ac-facility']);
  }

  logout() {
    this.router.navigate(['/login']);
  }
} 