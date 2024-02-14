import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoreDetailsModalPageRoutingModule } from './more-details-modal-routing.module';

import { MoreDetailsModalPage } from './more-details-modal.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoreDetailsModalPageRoutingModule
  ],
  declarations: [MoreDetailsModalPage],
  providers: [InAppBrowser]
})
export class MoreDetailsModalPageModule {}
