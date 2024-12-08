import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RateSpaceModalComponent } from './rate-space-modal.component';
import { AppStarRatingComponent } from '../app-star-rating/app-star-rating.component';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [RateSpaceModalComponent, AppStarRatingComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RateSpaceModalModule
 { }