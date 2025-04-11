import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { StudentLoginComponent } from './components/student-login/student-login.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AcFacilityComponent } from './components/ac-facility/ac-facility.component';
import { NonAcFacilityComponent } from './components/non-ac-facility/non-ac-facility.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserBookingsComponent } from './components/user-bookings/user-bookings.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'student-login', component: StudentLoginComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'ac-facility', component: AcFacilityComponent },
  { path: 'non-ac-facility', component: NonAcFacilityComponent },
  { path: 'user-login', component: UserLoginComponent },
  { path: 'user-bookings', component: UserBookingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 