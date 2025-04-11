import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentQrComponent } from '../payment-qr/payment-qr.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


interface TimeSlot {
  time: string;
  status: string;
}

@Component({
  selector: 'app-booking-modal',
  template: `
    <div class="modal-content booking-modal">
      <div class="modal-header">
        <h4 class="modal-title">
          <i class="fas fa-calendar-check me-2"></i>
          Book Seat {{seatNumber}}
        </h4>
        <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
      </div>
      <div class="modal-body">
        <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
          <div class="form-group mb-3">
            <label for="studentName" class="form-label">
              <i class="fas fa-user me-2"></i>Student Name
            </label>
            <input type="text" 
                   class="form-control" 
                   id="studentName" 
                   formControlName="studentName" 
                   required>
            <div *ngIf="bookingForm.get('studentName')?.invalid && bookingForm.get('studentName')?.touched" 
                 class="invalid-feedback d-block">
              Student name is required
            </div>
          </div>
          
          <div class="form-group mb-3">
            <label for="mobileNumber" class="form-label">
              <i class="fas fa-mobile-alt me-2"></i>Student Mobile Number
            </label>
            <input type="text" 
                   class="form-control" 
                   id="mobileNumber" 
                   formControlName="mobileNumber" 
                   required>
            <div *ngIf="bookingForm.get('mobileNumber')?.invalid && bookingForm.get('mobileNumber')?.touched" 
                 class="invalid-feedback d-block">
              Valid mobile number is required
            </div>
          </div>
          
          <div class="form-group mb-3">
            <label for="dateOfBirth" class="form-label">
              <i class="fas fa-birthday-cake me-2"></i>Date of Birth
            </label>
            <input type="date" 
                   class="form-control" 
                   id="dateOfBirth" 
                   formControlName="dateOfBirth" 
                   required>
            <div *ngIf="bookingForm.get('dateOfBirth')?.invalid && bookingForm.get('dateOfBirth')?.touched" 
                 class="invalid-feedback d-block">
              Date of birth is required
            </div>
          </div>
          
          <div class="form-group mb-3">
            <label for="facilityType" class="form-label">
              <i class="fas fa-building me-2"></i>Facility Type
            </label>
            <input 
              type="text" 
              class="form-control" 
              id="facilityType" 
              [value]="bookingForm.get('facilityType')?.value + ' Facility'"
              readonly>
          </div>
          
          <div class="form-group mb-3">
            <label class="form-label">
              <i class="fas fa-clock me-2"></i>Time Slots
            </label>
            <div class="time-slots-container">
              <div *ngFor="let slot of availableTimeSlots" class="form-check mb-2">
                <input class="form-check-input" 
                       type="checkbox" 
                       [id]="'slot-' + slot.time"
                       [value]="slot.time"
                       (change)="onTimeSlotChange($event, slot)">
                <label class="form-check-label" [for]="'slot-' + slot.time">
                  {{slot.time}}
                </label>
              </div>
            </div>
            <div *ngIf="selectedTimeSlots.length === 0 && formSubmitted" 
                 class="invalid-feedback d-block">
              Please select at least one time slot
            </div>
          </div>
          
          <div class="form-group mb-3">
            <label for="months" class="form-label">
              <i class="fas fa-calendar-alt me-2"></i>Number of Months
            </label>
            <select class="form-select" 
                    id="months" 
                    formControlName="months" 
                    (change)="updateDateRange()">
              <option value="">Select months</option>
              <option *ngFor="let i of [1,2,3,4,5,6,7,8,9,10,11,12]" [value]="i">
                {{i}} {{i === 1 ? 'month' : 'months'}}
              </option>
            </select>
            <div *ngIf="bookingForm.get('months')?.invalid && bookingForm.get('months')?.touched" 
                 class="invalid-feedback d-block">
              Please select number of months
            </div>
          </div>
          
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="fromDate" class="form-label">
                <i class="fas fa-calendar-day me-2"></i>From Date
              </label>
              <input type="date" 
                     class="form-control" 
                     id="fromDate" 
                     formControlName="fromDate" 
                     readonly>
            </div>
            <div class="col-md-6">
              <label for="toDate" class="form-label">
                <i class="fas fa-calendar-week me-2"></i>To Date
              </label>
              <input type="date" 
                     class="form-control" 
                     id="toDate" 
                     formControlName="toDate" 
                     readonly>
            </div>
          </div>  <!-- Added closing div -->
          
          <div class="form-group mb-3">
            <label for="seatNumber" class="form-label">
              <i class="fas fa-chair me-2"></i>Seat Number
            </label>
            <input type="text" 
                   class="form-control" 
                   id="seatNumber" 
                   [value]="seatNumber" 
                   readonly>
          </div>
          
          <div class="form-group mb-3">
            <label for="amount" class="form-label">
              <i class="fas fa-rupee-sign me-2"></i>Amount to be Paid
            </label>
            <input type="number" 
                   class="form-control" 
                   id="amount" 
                   formControlName="amount" 
                   required>
            <div *ngIf="bookingForm.get('amount')?.invalid && bookingForm.get('amount')?.touched" 
                 class="invalid-feedback d-block">
              Amount is required
            </div>
          </div>
          
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-check me-2"></i>Proceed to Payment
            </button>
            <button type="button" class="btn btn-outline-secondary" (click)="activeModal.dismiss()">
              <i class="fas fa-times me-2"></i>Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .booking-modal {
      border-radius: 10px;
      overflow: hidden;
      background: linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), 
                  url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
    }
    
    .modal-header {
      background-color: rgba(78, 115, 223, 0.1);
      border-bottom: 1px solid rgba(78, 115, 223, 0.2);
      padding: 1rem 1.5rem;
    }
    
    .modal-title {
      color: #4e73df;
      font-weight: 600;
    }
    
    .modal-body {
      padding: 1.5rem;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .form-label {
      font-weight: 600;
      color: #5a5c69;
      margin-bottom: 0.5rem;
    }
    
    .form-control, .form-select {
      border-radius: 8px;
      border: 1px solid #d1d3e2;
      padding: 0.75rem 1rem;
      transition: all 0.3s ease;
    }
    
    .form-control:focus, .form-select:focus {
      border-color: #4e73df;
      box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
    }
    
    .time-slots-container {
      max-height: 200px;
      overflow-y: auto;
      padding: 0.5rem;
      border: 1px solid #d1d3e2;
      border-radius: 8px;
      background-color: rgba(255, 255, 255, 0.7);
    }
    
    .form-check {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.2s ease;
    }
    
    .form-check:hover {
      background-color: rgba(78, 115, 223, 0.05);
    }
    
    .form-check-input:checked {
      background-color: #4e73df;
      border-color: #4e73df;
    }
    
    .form-check-label {
      font-weight: 500;
      color: #5a5c69;
    }
    
    .btn-primary {
      background-color: #4e73df;
      border-color: #4e73df;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
      background-color: #2e59d9;
      border-color: #2653d4;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .btn-outline-secondary {
      color: #858796;
      border-color: #d1d3e2;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn-outline-secondary:hover {
      background-color: #f8f9fc;
      color: #4e73df;
      border-color: #4e73df;
    }
    
    .invalid-feedback {
      color: #e74a3b;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }
    
    @media (max-width: 576px) {
      .modal-body {
        padding: 1rem;
      }
      
      .btn {
        padding: 0.5rem 1rem;
      }
    }
  `]
})
export class BookingModalComponent implements OnInit {
  @Input() seatNumber!: number;
  @Input() availableTimeSlots: TimeSlot[] = [];
  @Output() bookingComplete = new EventEmitter<any>();
  
  bookingForm: FormGroup;
  selectedTimeSlots: string[] = [];
  formSubmitted = false;
  
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient) 
    {
    this.bookingForm = this.fb.group({
      studentName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dateOfBirth: ['', Validators.required],
      facilityType: [{ value: '', disabled: true }, Validators.required],
      months: ['', Validators.required],
      fromDate: [{ value: '', disabled: true }],
      toDate: [{ value: '', disabled: true }],
      amount: ['', [Validators.required, Validators.min(0)]]
    });

    // Set today's date as from date
    const today = new Date();
    this.bookingForm.patchValue({
      fromDate: today.toISOString().split('T')[0]
    });
  }
  
  ngOnInit() {
    // Calculate initial amount
    this.calculateAmount();
  }
  
  onTimeSlotChange(event: any, slot: TimeSlot) {
    if (event.target.checked) {
      this.selectedTimeSlots.push(slot.time);
    } else {
      this.selectedTimeSlots = this.selectedTimeSlots.filter(time => time !== slot.time);
    }
    this.calculateAmount();
  }

  updateDateRange() {
    const months = this.bookingForm.get('months')?.value;
    const fromDate = new Date();

    if (months && fromDate) {
      const toDate = new Date(fromDate);
      toDate.setMonth(toDate.getMonth() + Number(months));

      this.bookingForm.patchValue({
        fromDate: fromDate.toISOString().split('T')[0],
        toDate: toDate.toISOString().split('T')[0]
      });
    }
    this.calculateAmount();
  }

  calculateAmount() {
    const baseAmount = this.bookingForm.get('facilityType')?.value === 'AC' ? 1000 : 500;
    const totalAmount = baseAmount * (this.bookingForm.get('months')?.value || 1) * (this.selectedTimeSlots.length || 1);
    this.bookingForm.get('amount')?.setValue(totalAmount);
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.bookingForm.invalid || this.selectedTimeSlots.length === 0) {
      if (this.selectedTimeSlots.length === 0) {
        alert('Please select at least one time slot');
      } else {
        alert('Please fill in all required fields correctly');
      }
      return;
    }

    const bookingData = {
      ...this.bookingForm.getRawValue(),
      timeSlots: this.selectedTimeSlots,
      seatNumber: this.seatNumber,
      facilityType: this.bookingForm.get('facilityType')?.value
    };

    console.log('Submitting booking data:', bookingData);

    const modalRef = this.modalService.open(PaymentQrComponent, { centered: true });
    modalRef.componentInstance.amount = this.bookingForm.value.amount;

    modalRef.result.then((paymentSuccess) => {
      if (paymentSuccess) {
        console.log('Payment successful, sending booking request...');
        
        this.http.post(`${environment.apiUrl}/api/book-seat`, bookingData, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).subscribe({
          next: (res: any) => {
            console.log('Booking successful:', res);
            alert('Booking successful!');
            this.bookingComplete.emit(bookingData);
            this.activeModal.close();
          },
          error: (err) => {
            console.error('Booking failed:', err);
            let errorMessage = 'Something went wrong. Please try again.';
            
            if (err.error) {
              if (err.error.message) {
                errorMessage = err.error.message;
              }
              if (err.error.details) {
                errorMessage += '\n' + err.error.details;
              }
              if (err.error.error) {
                console.error('Error details:', err.error.error);
              }
            }
            
            alert(errorMessage);
          }
        });
      } else {
        console.log('Payment was not successful');
        alert('Payment was not completed. Please try again.');
      }
    }).catch((err) => {
      console.log('Payment modal was dismissed', err);
    });
  }
}