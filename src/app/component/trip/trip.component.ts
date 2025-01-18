import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TripsService } from '../../services/trips.service';
import { Trip } from '../../interfaces/trip';


@Component({
  selector: 'app-trip',
  imports: [
    CommonModule

  ],
  templateUrl: './trip.component.html',
  styleUrl: './trip.component.scss'
})
export class TripComponent implements OnInit{

  trips: Trip[] = [];

  constructor( 
    private tripsService : TripsService
  ) { }

  ngOnInit() {
    this.tripsService.getTrips().subscribe(
      (data: Trip[]) => {
        this.trips = data;
      }
    );
    console.log(this.trips);
  }
}
