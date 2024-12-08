import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStarRatingComponent } from './app-star-rating.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppStarRatingComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [AppStarRatingComponent],
})
export class AppStarRatingModule {}