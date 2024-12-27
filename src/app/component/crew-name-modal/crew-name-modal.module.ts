import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CrewNameModalComponent } from './crew-name-modal.component';



@NgModule({
  declarations: [CrewNameModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [CrewNameModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class CrewNameModalModule { }
