import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-modify-rules-modal',
  templateUrl: './modify-rules-modal.page.html',
  styleUrls: ['./modify-rules-modal.page.scss'],
})
export class ModifyRulesModalPage implements OnInit {

  newRule: string = '';
  updatedRules: string[] = [];
  spaceId: any;

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private navParams: NavParams,
    private loadingController: LoadingController
  ) { 
    this.spaceId = this.navParams.get('spaceId');
    this.updatedRules = this.navParams.get('currentRules');
  }

  ngOnInit() {
  }

  addRule() {
    if (this.newRule.trim() !== '') {
      this.updatedRules.push(this.newRule);
      this.newRule = ''; // Clear the input field after adding
    }
  }

  removeRule(index: number) {
    this.updatedRules.splice(index, 1);
  }

  saveChanges() {
    this.updateChanges();
    this.modalController.dismiss({ updatedRules: this.updatedRules });

  }

  dismiss() {
    this.modalController.dismiss();
  }

  async updateChanges() {
    const spaceData = {"spaceId" : this.spaceId, "spaceRules" : this.updatedRules};
    const loading = await this.loadingController.create();
    await loading.present();


    this.apiService.updateRules(spaceData).subscribe(
      (response: any) => {
        loading.dismiss(); 
      },
      (error: any) => {
        console.error(error);
        loading.dismiss();
      }
    );

  }
}
