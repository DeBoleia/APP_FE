import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripsService } from '../../services/trips.service';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { LocationService } from '../../services/location.service';
import { MapDisplayComponent } from '../map-display/map-display.component';

@Component({
  selector: 'app-trip',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTabsModule,
    MapDisplayComponent
  ],
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss'],
})
export class TripComponent implements OnInit {
  isLinear = true;

  originFormGroup: FormGroup;
  destinationFormGroup: FormGroup;

  districts = ['District 1', 'District 2', 'District 3'];
  municipalities: string[] = [];
  parishes: string[] = [];

  destinationDistricts = [...this.districts];
  destinationMunicipalities: string[] = [];
  destinationParishes: string[] = [];

  constructor(
    private _formBuilder: FormBuilder, 
    private tripsService: TripsService,
    private locationService: LocationService
  ) {
    this.originFormGroup = this._formBuilder.group({
      district: ['', Validators.required],
      municipality: [''],
      parish: [''],
    });

    this.destinationFormGroup = this._formBuilder.group({
      district: ['', Validators.required],
      municipality: [''],
      parish: [''],
    });
  }

  ngOnInit(): void {
    this.loadDistricts();
    this.setupValueChanges();
  }

  loadDistricts(): void {
    this.locationService.getDistricts().subscribe({
      next: (districts) => {
        this.districts = districts;
        this.destinationDistricts = [...districts];
      },
      error: (error) => console.error('Failed to load districts:', error),
    });
  }

  setupValueChanges(): void {
    this.originFormGroup.get('district')?.valueChanges.subscribe((district) => {
      if (district) {
        this.locationService.getMunicipalities(district).subscribe({
          next: (municipalities) => {
            this.municipalities = municipalities;
            this.originFormGroup.get('municipality')?.reset('');
            this.parishes = [];
            this.originFormGroup.get('parish')?.reset('');
          },
          error: (error) => console.error('Failed to load municipalities:', error),
        });
      } else {
        this.municipalities = [];
        this.parishes = [];
      }
    });

    this.originFormGroup.get('municipality')?.valueChanges.subscribe((municipality) => {
      if (municipality) {
        this.locationService.getParishes(municipality).subscribe({
          next: (parishes) => {
            this.parishes = parishes;
            this.originFormGroup.get('parish')?.reset('');
          },
          error: (error) => console.error('Failed to load parishes:', error),
        });
      } else {
        this.parishes = [];
      }
    });

    this.destinationFormGroup.get('district')?.valueChanges.subscribe((district) => {
      if (district) {
        this.locationService.getMunicipalities(district).subscribe({
          next: (municipalities) => {
            this.destinationMunicipalities = municipalities;
            this.destinationFormGroup.get('municipality')?.reset('');
            this.destinationParishes = [];
            this.destinationFormGroup.get('parish')?.reset('');
          },
          error: (error) => console.error('Failed to load municipalities:', error),
        });
      } else {
        this.destinationMunicipalities = [];
        this.destinationParishes = [];
      }
    });

    this.destinationFormGroup.get('municipality')?.valueChanges.subscribe((municipality) => {
      if (municipality) {
        this.locationService.getParishes(municipality).subscribe({
          next: (parishes) => {
            this.destinationParishes = parishes;
            this.destinationFormGroup.get('parish')?.reset('');
          },
          error: (error) => console.error('Failed to load parishes:', error),
        });
      } else {
        this.destinationParishes = [];
      }
    });
  }
}