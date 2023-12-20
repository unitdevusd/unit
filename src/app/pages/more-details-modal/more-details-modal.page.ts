import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-more-details-modal',
  templateUrl: './more-details-modal.page.html',
  styleUrls: ['./more-details-modal.page.scss'],
})
export class MoreDetailsModalPage implements OnInit {
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
