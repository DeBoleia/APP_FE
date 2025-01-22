import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Trip } from '../../interfaces/trip';
import { AuthenticatorService } from '../../services/authenticator.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { TripsService } from '../../services/trips.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TruthyTypesOf } from 'rxjs';
import { MatDivider } from '@angular/material/divider';



@Component({
	selector: 'app-trip-card',
	imports: [
		CommonModule,
		MatCardModule,
		MatGridListModule,
		MatIconModule,
		MatTooltip,
		MatDivider
	],
	templateUrl: './trip-card.component.html',
	styleUrl: './trip-card.component.scss'
})
export class TripCardComponent implements OnInit{

	@Input() tripCode : string = '';
	trip : any ;
	constructor(
		private authService: AuthenticatorService,
		private tripsService: TripsService
	) { }


	ngOnInit(): void {
		this.tripsService.getTripByTripCode(this.tripCode).subscribe( data => {
			this.trip = data;
		})
	}

}
