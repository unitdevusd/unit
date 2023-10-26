import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterRolePage } from './register-role.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterRolePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRolePageRoutingModule {}
