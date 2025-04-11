import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { StudentLoginComponent } from './components/student-login/student-login.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AcFacilityComponent } from './components/ac-facility/ac-facility.component';
import { NonAcFacilityComponent } from './components/non-ac-facility/non-ac-facility.component';
import { BookingModalComponent } from './components/booking-modal/booking-modal.component';
import { PaymentQrComponent } from './components/payment-qr/payment-qr.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserBookingsComponent } from './components/user-bookings/user-bookings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StudentLoginComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AcFacilityComponent,
    NonAcFacilityComponent,
    BookingModalComponent,
    PaymentQrComponent,
    UserLoginComponent,
    UserBookingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule { } 