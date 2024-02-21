import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifyLocationPage } from './modify-location.page';

const routes: Routes = [
  {
    path: '',
    component: ModifyLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifyLocationPageRoutingModule {}
