import { Component, OnInit } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { MessageService } from '../../services/message.service';
import { AuthenticatorService } from '../../services/authenticator.service';
import {MatTabsModule} from '@angular/material/tabs';
import { TripsService } from '../../services/trips.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { AplicationCardComponent } from '../aplication-card/aplication-card.component';
import { StarRatingComponent } from "../star-rating/star-rating.component";
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ManageTripComponent } from '../manage-trip/manage-trip.component';

@Component({
  selector: 'app-my-trips',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatButton,
    AplicationCardComponent,
    StarRatingComponent,
    MatTooltip
],
  templateUrl: './my-trips.component.html',
  styleUrl: './my-trips.component.scss'
})
export class MyTripsComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticatorService,
    private userService: UserService,
    private messageService: MessageService,
    private tripService: TripsService,
    private dialog: MatDialog
  ) { }

  user: any = undefined;
  tripsAsDriver: any[] = [];
  tripsAsDriverDataSource: any;
  tripsAsPassenger: any[] = [];
  tripsAsPassengerDataSource: any;

  ngOnInit(): void {
    const userID =  this.authenticationService.getUserID();
    if (userID) {
      this.userService.getUserByUserID(userID).subscribe(user => {
        this.user = user;
        console.log('user: ', this.user);

        this.tripService.getTripsByDriver(userID).subscribe(trips => {
          this.tripsAsDriver = trips;
          this.tripsAsDriverDataSource = new MatTableDataSource(this.tripsAsDriver);
          console.log('tripsAsDriver: ', this.tripsAsDriver);
        });

        this.tripService.getTripsByPassenger(userID).subscribe(trips => {
          this.tripsAsPassenger = trips;
          this.tripsAsPassengerDataSource = new MatTableDataSource(this.tripsAsPassenger);
          console.log('tripsAsPassenger: ', this.tripsAsPassenger);
        });
      });
    }
  }

  manageTrip(tripCode: string) {
      ManageTripComponent.openDialog(this.dialog, { tripCode: tripCode });
    }

  
}
