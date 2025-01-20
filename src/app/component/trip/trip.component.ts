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
export class TripComponent implements OnInit {

  trips: Trip[] = [];

  constructor(
    private tripsService: TripsService
  ) { 
    console.log('TRIPS COMPONENT');
  }

  ngOnInit() {
    console.log('TRIPS COMPONENT');
    this.tripsService.getAllTrips().subscribe(
      (data: Trip[]) => {
        this.trips = data;
      }
    );
    console.log('TRIPS INFORMATION: ', this.trips);
  }
}
