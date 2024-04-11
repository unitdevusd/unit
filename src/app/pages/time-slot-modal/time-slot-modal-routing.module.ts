import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeSlotModalPage } from './time-slot-modal.page';

const routes: Routes = [
  {
    path: '',
    component: TimeSlotModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeSlotModalPageRoutingModule {}
