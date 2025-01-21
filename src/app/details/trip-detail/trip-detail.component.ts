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



@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDivider,
    MatDialogContent,
    MatDialogActions,
    MatDialogModule,
    MatGridListModule,
    GoogleMapsModule,
    MapDisplayComponent
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
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TripDetailComponent>,
    private directionService: MapDirectionsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.trip = this.data?.trip || {
      tripCode: "TRP12345",
      car: {
        brand: "Tesla",
        model: "Model 3",
        color: "Black",
        plate: "00-AA-00"
      },
      status: "inOffer",
      nrSeats: 4,
      estimatedCost: 100.0,
      pricePerPerson: 25.0,
      driver: {
        name: "John Doe",
        rating: 3.0,
      },
      passengers: ["Jane Smith", "Mark Johnson"],
      origin: {
        municipality: "Lisbon",
        parish: "Avenidas Novas",
        district: "Lisbon"
      },
      destination: {
        municipality: "Porto",
        parish: "Cedofeita",
        district: "Porto"
      },
      departureDate: new Date("2025-01-25T08:00:00"),
      createdAt: new Date("2025-01-20T14:30:00")

    };
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
