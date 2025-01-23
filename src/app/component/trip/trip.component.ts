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
    MatTabsModule
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

  constructor(private _formBuilder: FormBuilder, private tripsService: TripsService) {
    // Form groups for origin and destination
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
    this.setupValueChanges();
  }

  setupValueChanges() {
    // When district changes, fetch municipalities for origin
    this.originFormGroup.get('district')?.valueChanges.subscribe((district) => {
      this.municipalities = this.getMunicipalities(district);
      this.originFormGroup.get('municipality')?.reset('');
      this.parishes = [];
      this.originFormGroup.get('parish')?.reset('');
    });

    // When municipality changes, fetch parishes for origin
    this.originFormGroup.get('municipality')?.valueChanges.subscribe((municipality) => {
      this.parishes = this.getParishes(municipality);
      this.originFormGroup.get('parish')?.reset('');
    });

    // Same logic for destination
    this.destinationFormGroup.get('district')?.valueChanges.subscribe((district) => {
      this.destinationMunicipalities = this.getMunicipalities(district);
      this.destinationFormGroup.get('municipality')?.reset('');
      this.destinationParishes = [];
      this.destinationFormGroup.get('parish')?.reset('');
    });

    this.destinationFormGroup.get('municipality')?.valueChanges.subscribe((municipality) => {
      this.destinationParishes = this.getParishes(municipality);
      this.destinationFormGroup.get('parish')?.reset('');
    });
  }

  getMunicipalities(district: string): string[] {
    // Simulated API call
    if (district === 'District 1') return ['Municipality A', 'Municipality B'];
    if (district === 'District 2') return ['Municipality C', 'Municipality D'];
    if (district === 'District 3') return ['Municipality E', 'Municipality F'];
    return [];
  }

  getParishes(municipality: string): string[] {
    // Simulated API call
    if (municipality === 'Municipality A') return ['Parish X', 'Parish Y'];
    if (municipality === 'Municipality C') return ['Parish Z'];
    return [];
  }
}
