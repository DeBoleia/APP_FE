import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, OnChanges, AfterViewInit, OnInit } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapDirectionsService } from '@angular/google-maps';
import { BehaviorSubject, map } from 'rxjs';

@Component({
  selector: 'app-map-display',
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './map-display.component.html',
  styleUrl: './map-display.component.scss'
})
export class MapDisplayComponent implements OnInit {
  @ViewChild('map', { static: true }) map!: GoogleMap;

  zoom = 13;
  center!: google.maps.LatLngLiteral;
  markers = [
    { lat: 41.1403, lng: -8.6110 },
    { lat: 41.1622, lng: -8.5890 }
  ];

  @Input() from: google.maps.LatLng = new google.maps.LatLng(41.1403, -8.6110);
  @Input() to: google.maps.LatLng = new google.maps.LatLng(41.1622, -8.5890);

  directionsResult$ = new BehaviorSubject<
    google.maps.DirectionsResult | undefined
  >(undefined);

  constructor(private directionsService: MapDirectionsService) {}

  ngOnInit(): void {
    this.center = this.calculateCenter();
    // if (this.from && this.to) {
    //   this.getDirections(this.from, this.to);
    // } else if (this.from) {
    //   this.gotoLocation(this.from);
    // } else if (this.to) {
    //   this.gotoLocation(this.to);
    // }
  }


  gotoLocation(location: google.maps.LatLng | google.maps.LatLngLiteral) {
    const position =
      location instanceof google.maps.LatLng
        ? { lat: location.lat(), lng: location.lng() }
        : location;

    if (this.map && this.map.googleMap) {
      this.map.googleMap.panTo(position);
      this.zoom = 13;
      this.directionsResult$.next(undefined);
    } else {
      console.error('GoogleMap instance is not available');
    }
  }

  getDirections(
    fromLocation: google.maps.LatLng,
    toLocation: google.maps.LatLng
  ) {
    const origin = { lat: fromLocation.lat(), lng: fromLocation.lng() };
    const destination = { lat: toLocation.lat(), lng: toLocation.lng() };
  
    const request: google.maps.DirectionsRequest = {
      destination,
      origin,
      travelMode: google.maps.TravelMode.DRIVING,
    };
  
    this.directionsService
      .route(request)
      .pipe(map((response) => response.result))
      .subscribe({
        next: (res) => {
          if (res && res.routes && res.routes.length > 0) {
            console.log('Directions API response:', res); // Debugging
            this.directionsResult$.next(res);
          } else {
            console.error('No valid routes found:', res);
          }
        },
        error: (err) => {
          console.error('Error fetching directions:', err);
        },
      });  
  }

  calculateCenter() {
    if (this.from && this.to) {
      return {
        lat: (this.from.lat() + this.to.lat()) / 2,
        lng: (this.from.lng() + this.to.lng()) / 2,
      };
    } else if (this.from) {
      return { lat: this.from.lat(), lng: this.from.lng() };
    } else if (this.to) {
      return { lat: this.to.lat(), lng: this.to.lng() };
    } else {
      return { lat: 41.1403, lng: -8.6110 };
    }
  }
}
