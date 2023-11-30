import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactHostModalPage } from './contact-host-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ContactHostModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactHostModalPageRoutingModule {}
