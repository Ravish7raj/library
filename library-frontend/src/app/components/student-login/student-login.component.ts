import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Booking {
  id: number;
  student_name: string;
  mobile_number: string;
  dob: string;
  seat_number: string;
  from_date: string;
  to_date: string;
  duration: number;
  amount: number;
  amount_paid: number;
  status: string;
  time_slots: string[];
  facility_type: string;
}

@Component({
  selector: 'app-student-login',
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Student Login</h2>
        <div *ngIf="bookings.length > 0" class="student-info">
          <h3>Welcome, {{bookings[0].student_name}}!</h3>
          <div class="info-section">
            <h4>Personal Information</h4>
            <div class="info-item">
              <strong>Mobile Number:</strong> {{bookings[0].mobile_number}}
            </div>
            <div class="info-item">
              <strong>Date of Birth:</strong> {{bookings[0].dob | date:'mediumDate'}}
            </div>
          </div>
          
          <div class="bookings-section">
            <h4>Your Bookings</h4>
            <div *ngFor="let booking of bookings" class="booking-card">
              <div class="booking-header">
                <div class="header-left">
                  <span class="seat-number">Seat {{booking.seat_number}}</span>
                  <span class="facility-badge" [ngClass]="{'ac': booking.facility_type === 'AC', 'non-ac': booking.facility_type === 'NON-AC'}">
                    {{booking.facility_type}} Facility
                  </span>
                </div>
                <span class="status" [ngClass]="{'active': booking.status === 'active', 'expired': booking.status === 'expired'}">
                  {{booking.status | titlecase}}
                </span>
              </div>
              <div class="booking-details">
                <div class="info-item">
                  <strong>Date:</strong> {{booking.from_date | date:'mediumDate'}}
                </div>
                <div class="info-item">
                  <strong>Duration:</strong> {{calculateMonths(booking.from_date, booking.to_date)}} months
                </div>
                <div class="info-item">
                  <strong>Valid Till:</strong> {{booking.to_date | date:'mediumDate'}}
                </div>
                <div class="info-item">
                  <strong>Amount Paid:</strong> ₹{{booking.amount || booking.amount_paid || 0}}
                </div>
                <div class="info-item">
                  <strong>Time Slots:</strong>
                  <div class="time-slots">
                    <span *ngFor="let slot of booking.time_slots" class="time-slot">{{slot}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form *ngIf="bookings.length === 0" (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="mobileNumber">Mobile Number</label>
            <input
              type="text"
              class="form-control"
              id="mobileNumber"
              name="mobileNumber"
              [(ngModel)]="mobileNumber"
              required
              pattern="[0-9]{10}"
              #mobileNumberInput="ngModel"
              placeholder="Enter your 10-digit mobile number"
            >
            <div *ngIf="mobileNumberInput.invalid && (mobileNumberInput.dirty || mobileNumberInput.touched)" class="alert alert-danger">
              <div *ngIf="mobileNumberInput.errors?.['required']">Mobile number is required.</div>
              <div *ngIf="mobileNumberInput.errors?.['pattern']">Please enter a valid 10-digit mobile number.</div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="!loginForm.form.valid">Login</button>
        </form>
        <div class="mt-3">
          <button class="btn btn-link" (click)="goBack()">Back to Home</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
    }
    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 600px;
    }
    .student-info {
      text-align: center;
    }
    .info-section, .bookings-section {
      text-align: left;
      margin: 1.5rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .info-item {
      margin: 0.5rem 0;
      padding: 0.5rem;
      background: white;
      border-radius: 4px;
    }
    .booking-card {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #dee2e6;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .seat-number {
      font-size: 1.2rem;
      font-weight: bold;
      color: #1a73e8;
    }
    .facility-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
      display: inline-block;
    }
    .facility-badge.ac {
      background: #e3f2fd;
      color: #0d47a1;
      border: 1px solid #90caf9;
    }
    .facility-badge.non-ac {
      background: #fff3e0;
      color: #e65100;
      border: 1px solid #ffcc80;
    }
    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }
    .status.active {
      background: #d4edda;
      color: #155724;
    }
    .status.expired {
      background: #f8d7da;
      color: #721c24;
    }
    .time-slots {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .time-slot {
      background: #e9ecef;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .btn-link {
      color: #6c757d;
      text-decoration: none;
    }
    .btn-link:hover {
      color: #0056b3;
    }
    h4 {
      color: #1a73e8;
      margin-bottom: 1rem;
    }
  `]
})
export class StudentLoginComponent {
  mobileNumber: string = '';
  bookings: Booking[] = [];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // Clear any existing bookings data when component loads
    localStorage.removeItem('userBookings');
    localStorage.removeItem('userMobile');
    this.bookings = [];
  }

  calculateMonths(fromDate: string, toDate: string): number {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return months;
  }

  onSubmit() {
    if (this.mobileNumber.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    // Fetch bookings for the mobile number using query parameter
    this.http.get<Booking[]>(`${environment.apiUrl}/api/user-bookings?mobile_number=${this.mobileNumber}`)
      .subscribe({
        next: (bookings) => {
          console.log('Received bookings:', bookings);
          
          if (bookings && bookings.length > 0) {
            this.bookings = bookings.map(booking => ({
              ...booking,
              amount_paid: booking.amount || booking.amount_paid || 0
            }));
            
            // Store bookings in localStorage
            localStorage.setItem('userBookings', JSON.stringify(this.bookings));
            localStorage.setItem('userMobile', this.mobileNumber);
          } else {
            alert('No bookings found for this mobile number');
          }
        },
        error: (error) => {
          console.error('Error fetching bookings:', error);
          alert('Error fetching bookings. Please try again.');
        }
      });
  }

  goBack() {
    // Clear storage when going back
    localStorage.removeItem('userBookings');
    localStorage.removeItem('userMobile');
    this.router.navigate(['/']);
  }
} 