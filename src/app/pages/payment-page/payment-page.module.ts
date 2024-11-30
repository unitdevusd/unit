import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentPagePageRoutingModule } from './payment-page-routing.module';

import { PaymentPagePage } from './payment-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentPagePageRoutingModule
  ],
  declarations: [PaymentPagePage]
})
export class PaymentPagePageModule {}
