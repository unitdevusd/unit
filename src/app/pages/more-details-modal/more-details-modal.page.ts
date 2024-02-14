import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

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
    // private iab: InAppBrowser,
  ) { 
    this.place = this.navParams.get('place');
  }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {
  }

  // openVideoUrl(url: string) {
  //   const browser = this.iab.create(url);
  // }

}
