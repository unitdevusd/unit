import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactHostModalPageRoutingModule } from './contact-host-modal-routing.module';

import { ContactHostModalPage } from './contact-host-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactHostModalPageRoutingModule
  ],
  declarations: [ContactHostModalPage]
})
export class ContactHostModalPageModule {}
