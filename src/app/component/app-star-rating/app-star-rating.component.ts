import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-star-rating',
  templateUrl: './app-star-rating.component.html',
  styleUrls: ['./app-star-rating.component.scss'],
})
export class AppStarRatingComponent  implements OnChanges {

  @Input() rating: number = 0;
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

}
