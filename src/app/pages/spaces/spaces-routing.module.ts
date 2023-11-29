import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpacesPage } from './spaces.page';

const routes: Routes = [
  {
    path: '',
    component: SpacesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpacesPageRoutingModule {}
