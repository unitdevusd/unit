import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SpaceReceiptComponent } from './space-receipt.component';
import { AppComponent } from 'src/app/app.component';




@NgModule({
  declarations: [SpaceReceiptComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SpaceReceiptModule
 { }