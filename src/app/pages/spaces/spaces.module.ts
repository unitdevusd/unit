import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpacesPageRoutingModule } from './spaces-routing.module';

import { SpacesPage } from './spaces.page';
import { Camera } from '@ionic-native/camera/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpacesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SpacesPage],
  providers: [
    Camera
  ],
})
export class SpacesPageModule {}
