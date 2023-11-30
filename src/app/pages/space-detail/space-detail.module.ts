import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpaceDetailPageRoutingModule } from './space-detail-routing.module';

import { SpaceDetailPage } from './space-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpaceDetailPageRoutingModule
  ],
  declarations: [SpaceDetailPage]
})
export class SpaceDetailPageModule {}
