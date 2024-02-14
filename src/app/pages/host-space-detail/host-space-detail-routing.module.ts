import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HostSpaceDetailPage } from './host-space-detail.page';

const routes: Routes = [
  {
    path: '',
    component: HostSpaceDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HostSpaceDetailPageRoutingModule {}
