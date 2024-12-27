// crew-name-modal.component.ts
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-crew-name-modal',
  templateUrl: './crew-name-modal.component.html',
  styleUrls: ['./crew-name-modal.component.scss'],
})
export class CrewNameModalComponent {

  crewName: string = '';

  constructor(private modalController: ModalController) { }

  dismiss() {
    this.modalController.dismiss();
  }

  save() {
    this.modalController.dismiss({
      'crewName': this.crewName
    });
  }
}
