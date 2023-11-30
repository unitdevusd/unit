import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { SharedSpaceTypeSliderComponent } from '../component/shared-space-type-slider/shared-space-type-slider.component';
import { UnitListingComponent } from '../component/unit-listing/unit-listing.component';
import { SharedHostSpaceComponent } from '../component/shared-host-space/shared-host-space.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page, SharedSpaceTypeSliderComponent, UnitListingComponent, SharedHostSpaceComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class Tab1PageModule {}
