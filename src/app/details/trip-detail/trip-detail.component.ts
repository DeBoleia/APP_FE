import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Trip } from '../../interfaces/trip';
import { MatDivider } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list'
import { NgModule } from '@angular/core';
import { GoogleMapsModule, MapDirectionsService } from '@angular/google-maps';
import { TripCardComponent } from "../../component/trip-card/trip-card.component";
import { MapDisplayComponent } from "../../component/map-display/map-display.component";
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCard, MatCardModule } from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { TripsService } from '../../services/trips.service';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    // MatDivider,
    MatDialogContent,
    MatDialogActions,
    MatDialogModule,
    MatGridListModule,
    GoogleMapsModule,
    MapDisplayComponent,
    MatIcon,
    MatIconModule,
    MatCardModule,
    MatExpansionModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  templateUrl: './trip-detail.component.html',
  styleUrl: './trip-detail.component.scss'
})

export class TripDetailComponent implements OnInit {
  trip!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tripService: TripsService,
    private dialog: MatDialog,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // this.trip = this.data?.trip || {
    //   "car": "00-BB-98",
    //     "status": "inOffer",
    //     "nrSeats": 2,
    //     "estimatedCost": 50,
    //     "pricePerPerson": 25,
    //     "driver": "U013",
    //     "passengers": [],
    //     "origin": {
    //         "municipality": "Lisboa",
    //         "parish": "Alvalade",
    //         "district": "Porto",
    //         "_id": "678a44afd1211da3a4819a58"
    //     },
    //     "destination": {
    //         "municipality": "Oeiras",
    //         "parish": "Oeiras",
    //         "district": "Lisboa",
    //         "_id": "678a44afd1211da3a4819a59"
    //     },
    //     "departureDate": "2025-01-30T12:00:00.000Z",
    //     "tripCode": "RWFPJ1",
    //     "createdAt": "2025-01-17T11:53:19.813Z"
    // };
    this.loadData();
  }

  loadData() {
    this.tripService.getTripByTripCode('RWFPJ1').subscribe((trip: any) => {
      this.trip = trip;
      console.log(this.trip);
    });
  }


  static openDialog(dialog: MatDialog, data?: any): MatDialogRef<TripDetailComponent> {
    return dialog.open(TripDetailComponent, {
      width: '900px',
      autoFocus: true,
      disableClose: true,
      data: data
    });
  }
}
