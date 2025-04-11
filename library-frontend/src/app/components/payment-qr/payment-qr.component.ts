import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-qr',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Payment QR Code</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="cancel()"></button>
    </div>
    <div class="modal-body text-center">
      <div class="mb-3">
        <div class="qr-code-container">
          <img [src]="qrCodePath" alt="Payment QR Code" class="img-fluid qr-code">
        </div>
        <div class="mt-3">
          <p class="mb-2">Amount to Pay: ₹{{amount}}</p>
          <p class="mb-2">UPI ID: 9504564860&#64;ptyes</p>
        </div>
      </div>
      <div class="alert alert-info" role="alert">
        <i class="fas fa-info-circle me-2"></i>
        Please scan the QR code to make the payment. After successful payment, click on "Payment Complete".
      </div>
      <div class="d-grid gap-2">
        <button class="btn btn-success" (click)="confirmPayment()">
          <i class="fas fa-check me-2"></i>Payment Complete
        </button>
        <button class="btn btn-secondary" (click)="cancel()">Cancel</button>
      </div>
    </div>
  `,
  styles: [`
    .qr-code-container {
      width: 300px;
      height: 300px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .qr-code {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .modal-body {
      padding: 2rem;
    }
  `]
})
export class PaymentQrComponent {
  @Input() amount!: number;
  qrCodePath = 'assets/payment-qr.jpg';

  constructor(public activeModal: NgbActiveModal) {}

  confirmPayment() {
    this.activeModal.close(true);
  }

  cancel() {
    this.activeModal.dismiss('cancel');
  }
} 