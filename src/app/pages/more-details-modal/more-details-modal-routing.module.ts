import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoreDetailsModalPage } from './more-details-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MoreDetailsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoreDetailsModalPageRoutingModule {}
