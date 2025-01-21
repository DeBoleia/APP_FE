import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { TripCardComponent } from "../trip-card/trip-card.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-find-trips',
  imports: [
    MatGridListModule,
    TripCardComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule

  ],
  templateUrl: './find-trips.component.html',
  styleUrl: './find-trips.component.scss'
})
export class FindTripsComponent {

}
