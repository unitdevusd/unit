import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CashoutPage } from './cashout.page';

const routes: Routes = [
  {
    path: '',
    component: CashoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashoutPageRoutingModule {}
