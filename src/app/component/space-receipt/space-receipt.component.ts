import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-space-receipt',
  templateUrl: './space-receipt.component.html',
  styleUrls: ['./space-receipt.component.scss'],
})
export class SpaceReceiptComponent  implements OnInit {

  @Input() booking: any;
  constructor(
    private modalController: ModalController
  ) { 
    
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
