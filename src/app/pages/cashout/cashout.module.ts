import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CashoutPageRoutingModule } from './cashout-routing.module';

import { CashoutPage } from './cashout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CashoutPageRoutingModule
  ],
  declarations: [CashoutPage]
})
export class CashoutPageModule {}
