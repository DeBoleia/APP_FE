import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule, SizeProp } from '@fortawesome/angular-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-star-rating',
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss'
})
export class StarRatingComponent implements OnInit {
  faStar = faStar;
  faStarHalfAlt = faStarHalfAlt;

  @Input() size: SizeProp | undefined = "1x";
  @Input() rating = 0;
  @Input() nrEvaluations = 0;
  @Input() showEvaluations: boolean = false;
  @Input() readOnly: boolean = true;

  constructor() { }

  setRating(rating: number) {
    if (this.readOnly === true) {
      return;
    }
    this.rating = rating;
  }

  getStarIcon(star: number) {
    if (this.rating >= star) {
      return this.faStar;
    } else if (this.rating >= star - 0.5) {
      return this.faStarHalfAlt;
    } else {
      return this.faStar;
    }
  }

  getStarClass(star: number) {
    if (this.rating >= star) {
      return 'rated';
    } else if (this.rating >= star - 0.5) {
      return 'half-rated';
    } else {
      return '';
    }
  }


  ngOnInit(): void {
  }

}
