import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpaceDetailPage } from './space-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SpaceDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpaceDetailPageRoutingModule {}
