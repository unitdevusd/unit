import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifyLocationPageRoutingModule } from './modify-location-routing.module';

import { ModifyLocationPage } from './modify-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifyLocationPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModifyLocationPage]
})
export class ModifyLocationPageModule {}