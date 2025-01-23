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
import { map, startWith, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LocationService } from '../../services/location.service';

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

  trips: Trip[] = [];
  originDistrictControl = new FormControl('');
  originMunicipalityControl = new FormControl({ value: '', disabled: true });
  originParishControl = new FormControl({ value: '', disabled: true });

  destinationDistrictControl = new FormControl('');
  destinationMunicipalityControl = new FormControl({ value: '', disabled: true });
  destinationParishControl = new FormControl({ value: '', disabled: true });

  originFilteredDistricts!: Observable<string[]>;
  originFilteredMunicipalities!: Observable<string[]>;
  originFilteredParishes!: Observable<string[]>;
  originMunicipalities: string[] = [];
  originParishes: string[] = [];

  constructor(
    private tripsService: TripsService,
    private locationService: LocationService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.tripsService.getAllTrips().subscribe(data => {
      this.trips = data;
    });
  
    this.originFilteredDistricts = this.originDistrictControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterDistricts(value || ''))
    );
  
    this.originDistrictControl.valueChanges.pipe(
      switchMap(district => {
        if (district && this.districts.includes(district)) {
          this.originMunicipalityControl.enable();
          this.originParishControl.disable();
          this.originParishControl.reset();
          return this.locationService.getMunicipalities(district);
        }
        this.originMunicipalities = [];
        this.originMunicipalityControl.disable();
        this.originMunicipalityControl.reset();
        this.originParishes = [];
        this.originParishControl.disable();
        this.originParishControl.reset();
        return of([]);
      })
    ).subscribe(originMunicipalities => {
      this.originMunicipalities = originMunicipalities;
    });
  
    this.originFilteredMunicipalities = this.originMunicipalityControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = (value || '').toLowerCase();
        return this.originMunicipalities.filter(municipality =>
          municipality.toLowerCase().includes(filterValue)
        );
      })
    );
  
    this.originMunicipalityControl.valueChanges.pipe(
      switchMap(municipality => {
        if (municipality && this.originMunicipalities.includes(municipality)) {
          this.originParishControl.enable();
          return this.locationService.getParishes(municipality);
        }
        this.originParishes = [];
        this.originParishControl.disable();
        this.originParishControl.reset();
        return of([]);
      })
    ).subscribe(originParishes => {
      this.originParishes = originParishes;
    });
  
    this.originFilteredParishes = this.originParishControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = (value || '').toLowerCase();
        return this.originParishes.filter(parish =>
          parish.toLowerCase().includes(filterValue)
        );
      })
    );
  }

  triggerAutocomplete(control: FormControl, filteredOptions: Observable<string[]>): void {
    const currentValue = control.value || '';
    control.setValue(currentValue);
  }
  
  private filterDistricts(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.districts.filter(district =>
      district.toLowerCase().includes(filterValue)
    );
  }

  tripDetails(tripCode: string) {
    TripDetailComponent.openDialog(this.dialog, { tripCode: tripCode });
  }
}