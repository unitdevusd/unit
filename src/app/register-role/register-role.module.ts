import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterRolePageRoutingModule } from './register-role-routing.module';

import { RegisterRolePage } from './register-role.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterRolePageRoutingModule
  ],
  declarations: [RegisterRolePage]
})
export class RegisterRolePageModule {}
