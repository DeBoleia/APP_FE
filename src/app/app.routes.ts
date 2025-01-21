import { Routes } from '@angular/router';
import { UserComponent } from './component/user/user.component';
import { UserDetailsComponent } from './details/user-details/user-details.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';

import { HomeComponent } from './component/home/home.component';
import { TripComponent } from './component/trip/trip.component';
import { TripCardComponent } from './component/trip-card/trip-card.component';
import { FindTripsComponent } from './component/find-trips/find-trips.component';
import { MapDisplayComponent } from './component/map-display/map-display.component';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	// { path: 'trips', component: TripComponent },
	{ path: 'login', component: LoginComponent },
	{ path: "user", component: UserComponent/*, canActivate: [AuthGuard], data: { requiresAuth: true} */ },
	{ path: "user/:userID", component: UserDetailsComponent/*, canActivate: [AuthGuard], data: { requiresAuth: true} */ },
	{ path: "login", component: LoginComponent },
	{ path: "register", component: RegisterComponent },
	{ path: "trips", component: FindTripsComponent },
	{ path: "map", component: MapDisplayComponent }
];