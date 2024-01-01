import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpaceDetailPageRoutingModule } from './space-detail-routing.module';

import { SpaceDetailPage } from './space-detail.page';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpaceDetailPageRoutingModule,
    ReactiveFormsModule

  ],
  declarations: [SpaceDetailPage]
})
export class SpaceDetailPageModule {}
