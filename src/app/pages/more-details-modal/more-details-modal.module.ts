import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoreDetailsModalPageRoutingModule } from './more-details-modal-routing.module';

import { MoreDetailsModalPage } from './more-details-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoreDetailsModalPageRoutingModule
  ],
  declarations: [MoreDetailsModalPage]
})
export class MoreDetailsModalPageModule {}
