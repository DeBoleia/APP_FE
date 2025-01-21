import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Trip } from '../../interfaces/trip';
import { AuthenticatorService } from '../../services/authenticator.service';
import { MatGridListModule } from '@angular/material/grid-list';



@Component({
	selector: 'app-trip-card',
	imports: [
		CommonModule,
		MatCardModule,
		MatGridListModule
	],
	templateUrl: './trip-card.component.html',
	styleUrl: './trip-card.component.scss'
})
export class TripCardComponent implements OnInit{

	@Input() trip: Trip = {
		tripCode: "test123",
		car: {
			brand: "Honda",
			model: "Civic"
		},
		status: 'created',
		nrSeats: 4,
		estimatedCost: 1000,
		pricePerPerson: 1000,
		driver: "U013",
		passengers: ['U014', 'U012'],
		origin: {
			district: "Lisboa",
		},
		destination: {
			district: "Porto",
		},
		departureDate: new Date(),
		createdAt: new Date(),
	};

	constructor(
		private authService: AuthenticatorService,
	) { }

	ngOnInit(): void {
		console.log('TRIP CARD COMPONENT CALLED!');
	}

}
