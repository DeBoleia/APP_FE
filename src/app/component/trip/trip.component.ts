import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripsService } from '../../services/trips.service';
import { MatStepperModule, MatStepperNext } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { LocationService } from '../../services/location.service';
import { MapDisplayComponent } from '../map-display/map-display.component';
import { AuthenticatorService } from '../../services/authenticator.service';
import { UserService } from '../../services/user.service';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {FormsModule} from '@angular/forms';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import moment from 'moment';

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
    timeInput: 'HH:mm',  // Parse time format
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
     timeInput: 'HH:mm',  // Display time format
    timeOptionLabel: 'HH:mm',  // Time option label
  },
};

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
    MapDisplayComponent,
    MatDatepickerModule,
    MatTimepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    FormsModule,
  ],
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class TripComponent implements OnInit, AfterViewInit {
  isLinear = true;
  selectedTabIndex = 0;
  user: any;
  car: string = '';
  nrSeats: number = 1;
  departureDate: Date = new Date();
  departureTime: Date = moment().toDate();


  originFormGroup: FormGroup;
  destinationFormGroup: FormGroup;

  destinationDistricts = [
    "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Faro", "Guarda", "Leiria", "Lisboa", "Portalegre", "Porto", "R. A. Açores", "R. A. Madeira", "Santarém", "Setúbal", "Viana do Castelo", "Vila Real", "Viseu", "Évora"
  ];
  municipalities: string[] = [];
  parishes: string[] = [];

  destinationMunicipalities: string[] = [];
  destinationParishes: string[] = [];

  estimatedCost = 0;

  @ViewChild(MapDisplayComponent)
  mapDisplayComponent!: MapDisplayComponent;

  mapLoaded = false;

  constructor(
    private _formBuilder: FormBuilder, 
    private tripsService: TripsService,
    private locationService: LocationService,
    private authService: AuthenticatorService,
    private userProfileService: UserService
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

  ngAfterViewInit(): void {
    if (this.mapLoaded) {
      this.accessMapDistance();
    }
  }

  ngOnInit(): void {
    this.setupValueChanges();
    const user = this.authService.getUserID();
    if (user) {
      this.userProfileService.getUserByUserID(user).subscribe({
        next: (userData) => {
          this.user = userData;
        },
        error: (error) => {
          console.error('Failed to load user data:', error);
        }
      });
    } else {
      console.error('User ID is null');
    }
  }

  calculateEstimatedCost() {
    this.estimatedCost = this.mapDisplayComponent.distance * 0.4;
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


  onTripInfoLoaded() {
    const tripData = {
      car: this.car,
      nrSeats: this.nrSeats,
      estimatedCost: this.estimatedCost,
      pricePerPerson: this.estimatedCost / this.nrSeats,
      origin: this.originFormGroup.value,
      destination: this.destinationFormGroup.value,
      departureDate: this.departureDate
    };
    
    // Enviar os dados para o backend
    this.tripsService.createTrip(tripData).subscribe(response => {
      console.log('Trip created successfully', response);
    });
  }


  accessMapDistance(): void {
    // Delay the access to mapDisplayComponent to ensure it has enough time to load
    setTimeout(() => {
      if (this.mapDisplayComponent) {
        console.log('MapDisplayComponent', this.mapDisplayComponent);
        console.log('Distance:', this.mapDisplayComponent.distance);
      } else {
        console.error('MapDisplayComponent is still undefined');
      }
    }, 1000); // Adjust the delay as needed
  }

  goToNextTab(): void {
    if (this.selectedTabIndex < 2) {  // Assuming you have 3 tabs
      this.selectedTabIndex++;
    }
  }

  goToPreviousTab(): void {
    if (this.selectedTabIndex > 0) {
      this.selectedTabIndex--;
    }
  }
}