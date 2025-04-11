import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookingModalComponent } from '../booking-modal/booking-modal.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface TimeSlot {
  time: string;
  status: 'Booked' | 'Empty';
  userDetails?: {
    name: string;
    mobile: string;
    bookedTill: string;
  };
  bookingId?: number;
}

interface Seat {
  number: number;
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

interface BookingData {
  studentName: string;
  mobileNumber: string;
  timeSlots: string[];
  toDate: string;
  seatNumber: number;
}

interface Booking {
  id: number;
  seat_number: number;
  time_slots: string[];
  facility_type: string;
  student_name: string;
  mobile_number: string;
  to_date: string;
}

@Component({
  selector: 'app-ac-facility',
  template: `
    <div class="facility-container">
      <div class="facility-header">
        <div class="header-content">
          <h1>AC Facility</h1>
          <p>Air-conditioned study space with 22 comfortable seats</p>
        </div>
      </div>
      
      <div class="row justify-content-center">
        <div class="col-md-12">
          <div class="card main-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="d-flex align-items-center">
                  <i class="fas fa-snowflake facility-icon me-3"></i>
                  <h2 class="card-title mb-0">AC Facility Management</h2>
                </div>
                <button class="btn btn-outline-primary" (click)="goBack()">
                  <i class="fas fa-arrow-left me-2"></i> Back to Dashboard
                </button>
              </div>
              
              <div class="table-responsive">
                <table class="table table-bordered table-hover">
                  <thead class="table-light">
                    <tr>
                      <th class="seat-column">Seat Number</th>
                      <th>6am-10am</th>
                      <th>10am-2pm</th>
                      <th>2pm-6pm</th>
                      <th>6pm-10pm</th>
                      <th class="action-column">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let seat of seats" [ngClass]="{'table-active': !seat.isAvailable}">
                      <td class="seat-column">
                        <div class="seat-number">
                          <i class="fas fa-chair me-2"></i> Seat {{seat.number}}
                        </div>
                      </td>
                      <td *ngFor="let slot of seat.timeSlots">
                        <div class="slot-container" [ngClass]="{'booked': slot.status === 'Booked', 'empty': slot.status === 'Empty'}">
                          <div class="slot-status">
                            <span [ngClass]="{'text-danger': slot.status === 'Booked', 'text-success': slot.status === 'Empty'}">
                              <i [class]="slot.status === 'Booked' ? 'fas fa-user-check' : 'fas fa-user-plus'"></i>
                              {{slot.status}}
                            </span>
                          </div>
                          <div *ngIf="slot.userDetails" class="user-details">
                            <div class="detail-item">
                              <i class="fas fa-user"></i>
                              <span>{{slot.userDetails.name}}</span>
                            </div>
                            <div class="detail-item">
                              <i class="fas fa-mobile-alt"></i>
                              <span>{{slot.userDetails.mobile}}</span>
                            </div>
                            <div class="detail-item">
                              <i class="fas fa-calendar-alt"></i>
                              <span>Valid till: {{slot.userDetails.bookedTill | date:'dd MMM yyyy'}}</span>
                            </div>
                            <div class="detail-item mt-2">
                              <button class="btn btn-danger btn-sm" (click)="deleteBooking(slot.bookingId)">
                                <i class="fas fa-trash me-1"></i> Delete Booking
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="action-column">
                        <button *ngIf="seat.isAvailable" 
                                class="btn btn-primary btn-sm book-btn"
                                (click)="openBookingModal(seat)">
                          <i class="fas fa-bookmark me-1"></i> Book Now
                        </button>
                        <span *ngIf="!seat.isAvailable" class="text-danger">
                          <i class="fas fa-ban me-1"></i> Not Available
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .facility-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    
    .facility-header {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
                  url('https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
      background-size: cover;
      background-position: center;
      color: white;
      padding: 3rem 0;
      margin-bottom: 2rem;
    }
    
    .header-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    
    .header-content h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    
    .header-content p {
      font-size: 1.2rem;
      opacity: 0.9;
    }
    
    .main-card {
      border: none;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    
    .facility-icon {
      font-size: 2rem;
      color: #4e73df;
    }
    
    .table {
      border-radius: 8px;
      overflow: hidden;
    }
    
    .table thead th {
      background-color: #f1f3f9;
      border-bottom: 2px solid #e9ecef;
      font-weight: 600;
      color: #495057;
    }
    
    .table td {
      vertical-align: middle;
      padding: 0.75rem;
    }
    
    .seat-column {
      width: 120px;
      font-weight: 600;
    }
    
    .action-column {
      width: 100px;
      text-align: center;
    }
    
    .seat-number {
      display: flex;
      align-items: center;
      font-weight: 600;
    }
    
    .slot-container {
      padding: 0.5rem;
      border-radius: 6px;
      transition: all 0.3s ease;
    }
    
    .slot-container.booked {
      background-color: rgba(220, 53, 69, 0.1);
    }
    
    .slot-container.empty {
      background-color: rgba(40, 167, 69, 0.1);
    }
    
    .slot-status {
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    .user-details {
      font-size: 0.85rem;
      color: #6c757d;
    }
    
    .detail-item {
      display: flex;
      align-items: center;
      margin-bottom: 0.25rem;
    }
    
    .detail-item i {
      width: 20px;
      margin-right: 0.5rem;
      color: #4e73df;
    }
    
    .book-btn {
      transition: all 0.3s ease;
    }
    
    .book-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .text-success {
      color: #28a745 !important;
    }
    
    .text-danger {
      color: #dc3545 !important;
    }
    
    .btn-outline-primary {
      color: #4e73df;
      border-color: #4e73df;
    }
    
    .btn-outline-primary:hover {
      background-color: #4e73df;
      color: white;
    }
    
    .btn-danger {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
      line-height: 1.5;
      border-radius: 0.2rem;
    }
    
    .mt-2 {
      margin-top: 0.5rem;
    }
    
    @media (max-width: 768px) {
      .facility-header {
        padding: 2rem 0;
      }
      
      .header-content h1 {
        font-size: 2rem;
      }
      
      .header-content p {
        font-size: 1rem;
      }
    }
  `]
})
export class AcFacilityComponent implements OnInit {
  seats: Seat[] = Array(22).fill(null).map((_, index) => ({
    number: index + 1,
    isAvailable: true,
    timeSlots: [
      { time: '6am-10am', status: 'Empty' },
      { time: '10am-2pm', status: 'Empty' },
      { time: '2pm-6pm', status: 'Empty' },
      { time: '6pm-10pm', status: 'Empty' }
    ]
  }));
  bookings: Booking[] = [];

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    console.log('Loading bookings for AC facility');
    this.http.get<Booking[]>(`${environment.apiUrl}/api/active-bookings?facility_type=AC`)
      .subscribe({
        next: (bookings) => {
          console.log('Loaded bookings:', bookings);
          this.bookings = bookings;
          
          // Reset all slots to Empty first
          console.log('Resetting all slots to Empty');
          this.seats.forEach(seat => {
            seat.timeSlots.forEach(slot => {
              slot.status = 'Empty';
              slot.userDetails = undefined;
              slot.bookingId = undefined;
            });
            seat.isAvailable = true;
          });

          // Update slots based on bookings
          console.log('Updating slots based on bookings');
          bookings.forEach(booking => {
            console.log('Processing booking:', booking);
            const seat = this.seats[booking.seat_number - 1];
            if (seat) {
              console.log('Found seat:', seat.number, 'Booking ID:', booking.id);
              booking.time_slots.forEach(bookedSlot => {
                console.log('Processing time slot:', bookedSlot, 'for booking:', booking.id);
                const slot = seat.timeSlots.find(s => s.time === bookedSlot);
                if (slot) {
                  console.log('Marking slot as booked:', slot.time, 'with booking ID:', booking.id);
                  slot.status = 'Booked';
                  slot.bookingId = booking.id;
                  slot.userDetails = {
                    name: booking.student_name,
                    mobile: booking.mobile_number,
                    bookedTill: booking.to_date
                  };
                } else {
                  console.log('No matching slot found for:', bookedSlot);
                }
              });
              
              // Update seat availability if all slots are booked
              seat.isAvailable = seat.timeSlots.some(slot => slot.status === 'Empty');
              console.log('Updated seat availability:', seat.number, seat.isAvailable);
            } else {
              console.log('No matching seat found for booking:', booking);
            }
          });
          
          console.log('Final seats state:', this.seats);
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
        }
      });
  }

  isSlotBooked(seatNumber: number, timeSlot: string): boolean {
    return this.bookings.some(booking => 
      booking.seat_number === seatNumber && 
      booking.time_slots.includes(timeSlot)
    );
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }

  openBookingModal(seat: Seat) {
    const availableTimeSlots = seat.timeSlots.filter(slot => slot.status === 'Empty');
    
    const modalRef = this.modalService.open(BookingModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
    
    modalRef.componentInstance.seatNumber = seat.number;
    modalRef.componentInstance.availableTimeSlots = availableTimeSlots;
    
    // Set facility type
    modalRef.componentInstance.bookingForm?.get('facilityType')?.setValue('AC');

    modalRef.componentInstance.bookingComplete.subscribe((bookingData: BookingData) => {
      this.processBooking(seat, bookingData);
    });
  }

  processBooking(seat: Seat, bookingData: BookingData) {
    bookingData.timeSlots.forEach((timeSlot: string) => {
      const slot = seat.timeSlots.find(s => s.time === timeSlot);
      if (slot) {
        slot.status = 'Booked';
        slot.userDetails = {
          name: bookingData.studentName,
          mobile: bookingData.mobileNumber,
          bookedTill: new Date(bookingData.toDate).toISOString()
        };
      }
    });
    
    const allBooked = seat.timeSlots.every(slot => slot.status === 'Booked');
    if (allBooked) {
      seat.isAvailable = false;
    }
    
    console.log('Booking processed:', bookingData);
    this.loadBookings();
  }

  deleteBooking(bookingId: number | undefined) {
    if (!bookingId) {
      alert('Cannot delete booking: Invalid booking ID');
      return;
    }

    if (confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      this.http.delete(`${environment.apiUrl}/api/bookings/${bookingId}`).subscribe({
        next: () => {
          alert('Booking deleted successfully');
          this.loadBookings(); // Refresh the bookings list
        },
        error: (error) => {
          console.error('Error deleting booking:', error);
          alert('Failed to delete booking. Please try again.');
        }
      });
    }
  }
} 