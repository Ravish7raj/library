import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface Booking {
  id: number;
  seat_number: string;
  time_slots: string[];
  from_date: string;
  to_date: string;
  amount_paid: number;
  mobile_number: string;
  created_at: string;
}

@Component({
  selector: 'app-user-bookings',
  template: `
    <div class="container mt-4">
      <h2>Your Bookings</h2>
      
      <div *ngIf="loading" class="text-center my-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div *ngIf="!loading && !error">
        <div *ngIf="bookings.length === 0" class="alert alert-info">
          No bookings found for your mobile number.
        </div>

        <div *ngIf="bookings.length > 0" class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Seat Number</th>
                <th>Time Slots</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Amount Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let booking of bookings">
                <td>{{ booking.seat_number }}</td>
                <td>{{ booking.time_slots.join(', ') }}</td>
                <td>{{ booking.from_date | date }}</td>
                <td>{{ booking.to_date | date }}</td>
                <td>₹{{ booking.amount_paid }}</td>
                <td>
                  <span [class]="isExpired(booking) ? 'badge bg-danger' : 'badge bg-success'">
                    {{ isExpired(booking) ? 'Expired' : 'Active' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-4">
        <button class="btn btn-primary me-2" (click)="goToBooking()">Book New Seat</button>
        <button class="btn btn-secondary" (click)="goBack()">Back to Login</button>
      </div>
    </div>
  `,
  styles: [`
    .badge {
      font-size: 0.9em;
      padding: 0.5em 0.7em;
    }
  `]
})
export class UserBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings() {
    const mobileNumber = localStorage.getItem('userMobile');
    console.log('Fetching bookings for mobile:', mobileNumber);

    if (!mobileNumber) {
      this.error = 'No mobile number found. Please login again.';
      this.loading = false;
      return;
    }

    this.http.get<Booking[]>(`${environment.apiUrl}/api/user-bookings`, {
      params: { mobile_number: mobileNumber }
    }).subscribe({
      next: (bookings) => {
        console.log('Received bookings:', bookings);
        this.bookings = bookings;
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
        this.error = 'Failed to fetch your bookings. Please try again later.';
        this.loading = false;
      }
    });
  }

  isExpired(booking: Booking): boolean {
    return new Date(booking.to_date) < new Date();
  }

  goToBooking() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/student-login']);
  }
} 