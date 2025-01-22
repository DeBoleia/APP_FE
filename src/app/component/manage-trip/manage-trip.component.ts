import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from '../../services/message.service';
import { ApplicationsService } from '../../services/applications.service';
import { AuthenticatorService } from '../../services/authenticator.service';
import { TripDetailComponent } from '../../details/trip-detail/trip-detail.component';
import { TripsService } from '../../services/trips.service';

@Component({
  selector: 'app-manage-trip',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './manage-trip.component.html',
  styleUrl: './manage-trip.component.scss'
})
export class ManageTripComponent implements OnInit {

  trip: any;
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

  ngOnInit(): void {
      if (this.data?.tripCode) {
        this.tripService.getPassengersByTripCode
      }
  }

}
