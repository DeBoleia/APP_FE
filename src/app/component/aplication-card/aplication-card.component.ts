import { Component, input, Input } from '@angular/core';
import { AuthenticatorService } from '../../services/authenticator.service';
import { MessageService } from '../../services/message.service';
import { ApplicationsService } from '../../services/applications.service';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aplication-card',
  imports: [
    MatCardModule,
    CommonModule
  ],
  templateUrl: './aplication-card.component.html',
  styleUrl: './aplication-card.component.scss'
})
export class AplicationCardComponent {

  constructor(
    private authenticationService: AuthenticatorService,
    private messageService: MessageService,
    private applicationService: ApplicationsService,
    private userService: UserService

  ) { }

  @Input() applicationCode: string = '';
  @Input() user: User | undefined;
  @Input() isDriver: boolean = false;
  application: any;

  ngOnInit(): void {
    this.applicationService.getApplicationByApplicationCode(this.applicationCode).subscribe(application => {
      this.application = application;
      console.log('application: ', this.application);
    });
  }
}

// "applicationCode": "4DOG93",
// "status": "underReview",
// "applicationDate": "2025-01-22T10:29:16.415Z",
// "trip": "656CEJ",
// "user": {
//     "name": "lika",
//     "passengerRating": 2.5,
//     "passengerRatingCount": 1
// }