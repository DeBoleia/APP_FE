import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, OnChanges, AfterViewInit, OnInit } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapDirectionsService } from '@angular/google-maps';
import { BehaviorSubject, map } from 'rxjs';
import { LocationService } from '../../services/location.service';

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
  
  @Input() from: { parish?: string; municipality?: string; district?: string } = { municipality: 'Vila Nova de Gaia', district: 'Porto' };
  @Input() to: { parish?: string; municipality?: string; district?: string } = { parish: 'Bonfim', municipality: 'Porto', district: 'Porto' };

  fromCoords!: google.maps.LatLng;
  toCoords!: google.maps.LatLng;

  markers: { lat: number; lng: number }[] = [];

  directionsResult$ = new BehaviorSubject<
    google.maps.DirectionsResult | undefined
  >(undefined);

  constructor(private directionsService: MapDirectionsService, private locationService: LocationService) {}


  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap() {
    if (this.from && this.to) {
      this.locationService.getCoordinates(this.from).subscribe({
        next: (fromCoordinates) => {
          this.locationService.getCoordinates(this.to).subscribe({
            next: (toCoordinates) => {
              this.fromCoords = new google.maps.LatLng(fromCoordinates.lat, fromCoordinates.lng);
              this.toCoords = new google.maps.LatLng(toCoordinates.lat, toCoordinates.lng);
              // this.center = this.calculateCenter();
              this.markers = [fromCoordinates, toCoordinates];
              this.getDirections(this.fromCoords, this.toCoords);
              // this.updateMap();
            },
            error: (err) => console.error('Error fetching destination coordinates:', err),
          });
        },
        error: (err) => console.error('Error fetching origin coordinates:', err),
      });
    } else {
      console.error('Both `from` and `to` objects must be provided.');
    }
  }

  updateMap() {
    const bounds = new google.maps.LatLngBounds();

    bounds.extend(this.fromCoords);
    bounds.extend(this.toCoords);
    this.map?.googleMap?.fitBounds(bounds);

    this.zoom = this.calculateZoomLevel(bounds);
    this.map?.googleMap?.setZoom(this.zoom);

    this.center = { lat: bounds.getCenter().lat(), lng: bounds.getCenter().lng() };
    this.map?.googleMap?.setCenter(this.center);
  }

  calculateZoomLevel(bounds: google.maps.LatLngBounds): number {
    // You can fine-tune this based on your preference and the size of your markers
    const maxLat = bounds.getNorthEast().lat();
    const minLat = bounds.getSouthWest().lat();
    const maxLng = bounds.getNorthEast().lng();
    const minLng = bounds.getSouthWest().lng();

    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;

    const zoomLevel = Math.max(2, Math.min(16, Math.round(15 - Math.log(Math.max(latDiff, lngDiff)) / Math.LN2)));
    return zoomLevel;
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
    if (this.fromCoords && this.toCoords) {
      return {
        lat: (this.fromCoords.lat() + this.toCoords.lat()) / 2,
        lng: (this.fromCoords.lng() + this.toCoords.lng()) / 2,
      };
    } else if (this.fromCoords) {
      return { lat: this.fromCoords.lat(), lng: this.fromCoords.lng() };
    } else if (this.toCoords) {
      return { lat: this.toCoords.lat(), lng: this.toCoords.lng() };
    } else {
      return { lat: 41.1403, lng: -8.6110 };
    }
  }
}
