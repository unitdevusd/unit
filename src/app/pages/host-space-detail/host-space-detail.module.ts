import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HostSpaceDetailPageRoutingModule } from './host-space-detail-routing.module';

import { HostSpaceDetailPage } from './host-space-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HostSpaceDetailPageRoutingModule
  ],
  declarations: [HostSpaceDetailPage]
})
export class HostSpaceDetailPageModule {}
