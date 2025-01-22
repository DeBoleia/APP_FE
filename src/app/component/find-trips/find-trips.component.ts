import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { TripCardComponent } from "../trip-card/trip-card.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { Trip } from '../../interfaces/trip';
import { TripsService } from '../../services/trips.service';
import { CommonModule } from '@angular/common';
import { TripDetailComponent } from '../../details/trip-detail/trip-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-find-trips',
  imports: [
    CommonModule,
    MatGridListModule,
    TripCardComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,

  ],
  templateUrl: './find-trips.component.html',
  styleUrl: './find-trips.component.scss'
})
export class FindTripsComponent implements OnInit {
  districts = [
    "Aveiro",
    "Beja",
    "Braga",
    "Bragança",
    "Castelo Branco",
    "Coimbra",
    "Évora",
    "Faro",
    "Guarda",
    "Leiria",
    "Lisboa",
    "Portalegre",
    "Porto",
    "Santarém",
    "Setúbal",
    "Viana do Castelo",
    "Vila Real",
    "Viseu"
  ]

  municipalities = [];

  trips: Trip[] = [];

  originControl: FormControl = new FormControl('');

  constructor(
    private tripsService: TripsService,
    private dialog: MatDialog
  ) { }

  tripDetails(tripCode: string) {
    TripDetailComponent.openDialog(this.dialog, { tripCode: tripCode });
  }

  ngOnInit(): void {
    this.tripsService.getAllTrips().subscribe(data => {
      this.trips = data
      console.log(this.trips);
    })
  }


}
