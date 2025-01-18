import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { TripComponent } from './component/trip/trip.component';
import { UserComponent } from './component/user/user.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'trips', component: TripComponent }
//    { path: 'login', component: LoginComponent }
  ];
  