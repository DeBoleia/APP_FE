import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map-display',
  imports: [
    CommonModule,
    GoogleMapsModule
  ],
  templateUrl: './map-display.component.html',
  styleUrl: './map-display.component.scss'
})
export class MapDisplayComponent {

  center: google.maps.LatLngLiteral = { lng: -8.006489496367871, lat: 36.96171046617662 };
  zoom = 10;
  markers = [
    { lat: 40.73061, lng: -73.935242 },
    { lat: 40.74988, lng: -73.968285 }
  ];

}
