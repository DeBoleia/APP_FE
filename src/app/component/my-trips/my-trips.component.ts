import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { MessageService } from '../../services/message.service';
import { AuthenticatorService } from '../../services/authenticator.service';
import {MatTabsModule} from '@angular/material/tabs';
import { TripsService } from '../../services/trips.service';

@Component({
  selector: 'app-my-trips',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTabsModule
  ],
  templateUrl: './my-trips.component.html',
  styleUrl: './my-trips.component.scss'
})
export class MyTripsComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticatorService,
    private userService: UserService,
    private messageService: MessageService,
    private tripService: TripsService
  ) { }

  user!: User | null;
  tripsAsDriver: any[] = [];
  tripsAsPassenger: any[] = [];

  ngOnInit(): void {
    const userID = this.authenticationService.getUserID();
    if (userID) {
      this.userService.getUserByUserID(userID).subscribe(user => {
        this.user = user;
        console.log('user: ', this.user);

        this.tripService.getTripsByDriver(userID).subscribe(trips => {
          this.tripsAsDriver = trips;
          console.log('tripsAsDriver: ', this.tripsAsDriver);
        });

        this.tripService.getTripsByPassenger(userID).subscribe(trips => {
          this.tripsAsPassenger = trips;
          console.log('tripsAsPassenger: ', this.tripsAsPassenger);
        });
      });
    }
  }

  
}
