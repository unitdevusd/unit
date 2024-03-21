import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAccountPageRoutingModule } from './add-account-routing.module';

import { AddAccountPage } from './add-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddAccountPageRoutingModule
  ],
  declarations: [AddAccountPage]
})
export class AddAccountPageModule {}
