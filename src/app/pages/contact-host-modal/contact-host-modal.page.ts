import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-contact-host-modal',
  templateUrl: './contact-host-modal.page.html',
  styleUrls: ['./contact-host-modal.page.scss'],
})
export class ContactHostModalPage implements OnInit {

  place: any;


  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
  ) { 
    this.place = this.navParams.get('place');
  }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {
  }

}
