import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from '../../services/message.service';
import { ApplicationsService } from '../../services/applications.service';
import { AuthenticatorService } from '../../services/authenticator.service';
import { TripDetailComponent } from '../../details/trip-detail/trip-detail.component';
import { TripsService } from '../../services/trips.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { StarRatingComponent } from "../star-rating/star-rating.component";
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-manage-trip',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    StarRatingComponent,
    MatDialogModule,
    MatListModule,
    MatGridListModule
  ],
  templateUrl: './manage-trip.component.html',
  styleUrl: './manage-trip.component.scss'
})
export class ManageTripComponent implements OnInit {

  trip: any;
  passengers: any = [];
  candidates: any = [];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tripCode: string },
    private tripService: TripsService,
    private dialogRef: MatDialogRef<TripDetailComponent>,
    private authenticatorService: AuthenticatorService,
    private applicationService: ApplicationsService,
    private messageService: MessageService
  ) { }

  static openDialog(dialog: MatDialog, data?: { tripCode: string }): MatDialogRef<ManageTripComponent> {
    return dialog.open(ManageTripComponent, {
      minWidth: '1000px',
      autoFocus: true,
      disableClose: true,
      data: data
    });
  }

  loadData() {
    if (this.data?.tripCode) {
      forkJoin({
        trip: this.tripService.getTripByTripCode(this.data.tripCode).pipe(catchError(error => of(null))),
        candidates: this.applicationService.getApplicationByTripCode(this.data.tripCode).pipe(catchError(error => of([]))),
        passengers: this.tripService.getPassengersByTripCode(this.data.tripCode).pipe(catchError(error => of([])))
      }).subscribe(({ trip, candidates, passengers }) => {
        this.trip = trip;
        this.candidates = candidates;
        this.passengers = passengers;
        console.log('trip', this.trip);
        console.log('candidates', this.candidates);
        console.log('passengers', this.passengers);
      });
    }
  }

  ngOnInit(): void {
    this.loadData();
  }
}
