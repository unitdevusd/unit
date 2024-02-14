import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifyRulesModalPageRoutingModule } from './modify-rules-modal-routing.module';

import { ModifyRulesModalPage } from './modify-rules-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifyRulesModalPageRoutingModule
  ],
  declarations: [ModifyRulesModalPage]
})
export class ModifyRulesModalPageModule {}
