import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeSlotModalPageRoutingModule } from './time-slot-modal-routing.module';

import { TimeSlotModalPage } from './time-slot-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimeSlotModalPageRoutingModule
  ],
  declarations: [TimeSlotModalPage]
})
export class TimeSlotModalPageModule {}
