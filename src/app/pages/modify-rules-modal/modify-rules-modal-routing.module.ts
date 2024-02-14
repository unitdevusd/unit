import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifyRulesModalPage } from './modify-rules-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ModifyRulesModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifyRulesModalPageRoutingModule {}
