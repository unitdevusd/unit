import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-app-star-rating',
  templateUrl: './app-star-rating.component.html',
  styleUrls: ['./app-star-rating.component.scss'],
})
export class AppStarRatingComponent  implements OnChanges {

  @Input() rating: number = 0;
  @Output() ratingChange = new EventEmitter<number>();
  stars: string[] = [];

  ngOnChanges() {
    this.setStars();
  }

  setStars() {
    this.stars = Array(5).fill('star-outline');
    for (let i = 0; i < Math.floor(this.rating); i++) {
      this.stars[i] = 'star';
    }
    if (this.rating % 1 !== 0) {
      this.stars[Math.floor(this.rating)] = 'star-half';
    }
  }

  onStarClick(index: number) {
    this.rating = index + 1; 
    this.setStars();
    this.ratingChange.emit(this.rating);
  }

}
