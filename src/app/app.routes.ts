import { Routes } from '@angular/router';
import { UserComponent } from './component/user/user.component';
import { UserDetailsComponent } from './details/user-details/user-details.component';
import { LoginComponent } from './component/login/login.component';


import { HomeComponent } from './component/home/home.component';
import { RegisterComponent } from './component/register/register.component';
import { ApplicationComponent } from './component/application/application.component';
import { TripComponent } from './component/trip/trip.component';
import { RgpdComponent } from './component/rgpd/rgpd.component';
import { AboutusComponent } from './component/aboutus/aboutus.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
//    { path: 'login', component: LoginComponent }
  
	{ path: "user", component: UserComponent/*, canActivate: [AuthGuard], data: { requiresAuth: true} */},
	{ path: "user/:userID", component: UserDetailsComponent/*, canActivate: [AuthGuard], data: { requiresAuth: true} */},
	{ path: "login", component: LoginComponent },
	{ path: "register", component: RegisterComponent },
	{ path: "home", component: HomeComponent },
	{ path: "application", component: ApplicationComponent },
	{ path: "trip", component: TripComponent },
	{ path: 'rgpd', component: RgpdComponent }, 
	{ path: 'aboutus', component: AboutusComponent },
	{ path: 'change-password', component: ChangePasswordComponent }

];
  