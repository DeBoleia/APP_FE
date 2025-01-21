import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Trip } from '../../interfaces/trip';
import { MatDivider } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list'

@Component({
  selector: 'app-trip-detail',
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
    MatGridListModule
  ],
  templateUrl: './trip-detail.component.html',
  styleUrl: './trip-detail.component.scss'
})

export class TripDetailComponent implements OnInit {
  trip!: Trip;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TripDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.trip = this.data?.trip || {
      tripCode: "TRP12345",
      car: "Toyota Corolla 2020",
      status: "inOffer",
      nrSeats: 4,
      estimatedCost: 100.0,
      pricePerPerson: 25.0,
      driver: "John Doe",
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
