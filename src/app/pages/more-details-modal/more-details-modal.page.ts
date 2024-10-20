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
  editedChargePerDay: number | null = null;
  editedDescription: string | '';
  editedPractice: string | '';
  editedMusicDetails: string | '';




  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private apiService: ApiService,
    private userService: UserService,
    // private iab: InAppBrowser,
  ) { 
    this.place = this.navParams.get('place');
    this.editedAdditionalDetails = this.place.additionalDetails;
    this.editedChargePerDay = this.place.chargePerDay;
    this.editedAdditionalDetails = this.place.additionalDetails;
    this.editedDescription = this.place.description;
    this.editedPractice = this.place.practice;
    this.editedMusicDetails = this.place.musicDetails;
    
    this.spaceId = this.navParams.get('spaceId');

    this.userDetails = this.userService.getUserDetails();
    this.role = this.userDetails?.role;
  }

  dismiss() {
    this.modalController.dismiss({
      place: this.place,
    });
  }

  ngOnInit() {
  }

  // openVideoUrl(url: string) {
  //   const browser = this.iab.create(url);
  // }

  formatTimeSlots(timeSlots: any[]): string {
    return timeSlots.map(slot => `${slot.date} from ${slot.startTime} to ${slot.endTime}`).join(', ');
  }

  toggleEdit() {
    if (this.isEditing) {
      const spaceData = {"spaceId" : this.spaceId, "additionalDetails" : this.editedAdditionalDetails,
      "description": this.editedDescription, "chargePerDay": this.editedChargePerDay, "practice" : this.editedPractice,
    "musicDetails" : this.editedMusicDetails};

    console.log(spaceData);

      this.apiService.updateUrl(spaceData).subscribe(
        (response: any) => {
          console.log(response);
          this.place = response;
        },
        (error: any) => {
          console.error(error);
        }
      );



    } else {
      this.editedAdditionalDetails = this.place.additionalDetails;
      this.editedChargePerDay = this.place.chargePerDay;
      this.editedAdditionalDetails = this.place.additionalDetails;
      this.editedDescription = this.place.description;
      this.editedPractice = this.place.practice;
      this.editedMusicDetails = this.place.musicDetails;
    }
    this.isEditing = !this.isEditing;
  }

}
