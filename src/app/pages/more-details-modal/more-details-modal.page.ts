import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { UserService } from 'src/app/services/user.service';
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-more-details-modal',
  templateUrl: './more-details-modal.page.html',
  styleUrls: ['./more-details-modal.page.scss'],
})
export class MoreDetailsModalPage implements OnInit {
  place: any;
  isEditing: boolean = false;
  editedAdditionalDetails: string;
  spaceId: any;
  role: string;
  userDetails: any;



  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private apiService: ApiService,
    private userService: UserService,
    // private iab: InAppBrowser,
  ) { 
    this.place = this.navParams.get('place');
    this.spaceId = this.navParams.get('spaceId');

    this.userDetails = this.userService.getUserDetails();
    this.role = this.userDetails?.role;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {
  }

  // openVideoUrl(url: string) {
  //   const browser = this.iab.create(url);
  // }

  toggleEdit() {
    if (this.isEditing) {
      // Save the edited value and perform any necessary actions
      this.place.additionalDetails = this.editedAdditionalDetails;

      const spaceData = {"spaceId" : this.spaceId, "additionalDetails" : this.editedAdditionalDetails};

      this.apiService.updateUrl(spaceData).subscribe(
        (response: any) => {
          // this.modalController.dismiss({ updatedSpace: response });
  
        },
        (error: any) => {
          console.error(error);
        }
      );



    } else {
      // Set the initial value of the edited field
      this.editedAdditionalDetails = this.place.additionalDetails;
    }
    this.isEditing = !this.isEditing;
  }

}
