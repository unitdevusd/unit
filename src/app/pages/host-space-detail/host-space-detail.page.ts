import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder/ngx';
import { MoreDetailsModalPage } from '../more-details-modal/more-details-modal.page';
import { ContactHostModalPage } from '../contact-host-modal/contact-host-modal.page';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModifyRulesModalPage } from '../modify-rules-modal/modify-rules-modal.page';
import { ModifyLocationPage } from '../modify-location/modify-location.page';
import { TimeSlotModalPage } from '../time-slot-modal/time-slot-modal.page';
import { TimeSlots } from 'src/app/shared/time-slots';


@Component({
  selector: 'app-host-space-detail',
  templateUrl: './host-space-detail.page.html',
  styleUrls: ['./host-space-detail.page.scss'],
})
export class HostSpaceDetailPage implements OnInit {

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  autocompleteItems: any[];
  autocomplete: any;
  spaceId: any;
  place: any;
  // public spaceForm!: FormGroup;
  userId: any;
  userDetails: any;
  firstName: any;
  rules: string[] = [];
  spaceImages: string[] = [];
  newRule: { input: string; };
  GoogleAutocomplete: any;
  address: string;
  totalSize: number = 0;
  largestFileSize: number = 0;
  public sanitizedUrl: SafeResourceUrl;
  availableTimeSlots: TimeSlots[] = [];
  date: string = '';




  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private _apiService: ApiService,
    private toastController: ToastController,
    private userService : UserService,
    public zone: NgZone,
    private alertController: AlertController,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    private navCtrl: NavController,
    private modalCtrl: ModalController,



  ) {
    this.spaceId = this.route.snapshot.paramMap.get('spaceId');
    console.log('Space ID is '+this.spaceId);
    this.userDetails = this.userService.getUserDetails();
    this.userId = this.userDetails?.userId;
    this.firstName = this.userDetails?.firstName || 'Guest';
    const url = `https://maps.google.com/maps?q=41.8781136,-87.6297982&z=10&output=embed`;
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    this.getSpaceById();

   }

  ngOnInit() {
  }


  async getSpaceById() {

    try {
      console.log('Retrieving list of spaces with Id '+this.spaceId);
      const loading = await this.loadingController.create();
      await loading.present();
  
      if (this.spaceId) {
        const spaceData = {"spaceId" : this.spaceId};
        this._apiService.getSpaceBySpaceId(spaceData).subscribe(
          (response: any) => {
            loading.dismiss();
            this.place = response;
            console.log('Place Location is '+this.place.spaceLocation);
            const url = `https://maps.google.com/maps?q=${this.place.lat},${this.place.lng}&z=10&output=embed`;
            this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

          },
          (error: any) => {
            console.error(error);
            loading.dismiss();
            this.showToast('Unable to fetch spaces');             
            // this.showErrorAlert('Unexpected error occurred');
          }
        );
      }
    } catch (error) {
      console.error(error);
    }

  }


  async confirmDelete() {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this space?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteSpaceById();
          }
        }
      ]
    });
  
    await alert.present();
  
  }


  async deleteSpaceById() {
    const loading = await this.loadingController.create();
    await loading.present();

    const spaceData = {"spaceId" : this.spaceId};

    this._apiService.deleteSpace(spaceData).subscribe(
      (response: any) => {
        if(response == 'Deleted') {
        loading.dismiss(); 
        
        
        let navigationExtras: NavigationExtras = {
          state: {
            navigationData: true
          }
        };
        this.router.navigateByUrl(`/tabs`, navigationExtras);
  // this.router.navigateByUrl('/tabs', { replaceUrl: true }); 
        this.showToast('Space deleted successfully');   
      }
      else {
        loading.dismiss(); 
        this.showToast('Unable to delete space. Try again later');             

      }                

      },
      (error: any) => {
        console.error(error);
        loading.dismiss();
        this.showToast('Unable to delete space');             
        // this.showErrorAlert('Unexpected error occurred');
      }
    );

  }


  async changeLocation() {

    const modal = await this.modalController.create({
      component: ModifyLocationPage,
      breakpoints: [0,9],
      initialBreakpoint: 0.6,
      handle: false,
      componentProps: {
        spaceId: this.spaceId
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    
    if (data && data.updatedSpace) {
      this.place = data.updatedSpace;
      const url = `https://maps.google.com/maps?q=${data.updatedSpace.lat},${data.updatedSpace.lng}&z=10&output=embed`;
      this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.showToast('Location updated successfully');             

    }

  }

  
  async modifyRules() {
    const modal = await this.modalController.create({
      component: ModifyRulesModalPage,
      breakpoints: [0,9],
      initialBreakpoint: 0.6,
      handle: false,
      componentProps: {
        currentRules: this.place.spaceRules,
        spaceId: this.spaceId
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    
    if (data && data.updatedRules) {
      // Update rules with the updated rules from the modal
      this.place.spaceRules = data.updatedRules;
    }
  }



  async showToast(message: any) {

      const toast = await this.toastController.create({
        message: message,
        duration: 4000,
        position: 'bottom',
        cssClass: 'centered-toast',
      });
      toast.present();
  

  }

  onInputChange(event: any) {
    this.newRule.input = event.target.value;
  }


  addRule() {
    console.log('Adding rule');
    console.log('New rule:', this.newRule);
    if (this.newRule.input !== '') {
      this.rules.push(this.newRule.input);
      this.newRule.input = '';
      console.log(this.rules);
      const inputElement = document.getElementById('rules');
      if (inputElement) {
        (inputElement as HTMLInputElement).value = '';
      }
    }
    
  }


  async showSuccessAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async showErrorAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }



  selectNewImages() {
    const inputElement: HTMLElement | null = document.querySelector('input[type="file"]');
    if (inputElement) {
      inputElement.click();
    }
  }


  onFileChange(event: any) {
    const files: FileList = event.target.files;
  
    this.totalSize = 0;
    this.largestFileSize = 0;
  
    if (files && files.length > 0) {
  
      const promises: Promise<string>[] = [];
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.totalSize += file.size;
  
        if (file.size > this.largestFileSize) {
          this.largestFileSize = file.size;
        }
  
        if (file && !(this.largestFileSize > 2 * 1024 * 1024) && !(this.totalSize > 10 * 1024 * 1024)) {
          promises.push(this.convertToBase64(file));
        }
      }
  
      console.log(this.totalSize);
      console.log(this.largestFileSize);
  
      // Update message display based on total size and largest file size
      const maxTotalUploadMessage = document.getElementById('max-total-upload-message');
      const maxUploadPerFileMessage = document.getElementById('max-upload-per-file-message');
  
      if (maxTotalUploadMessage) {
        maxTotalUploadMessage.style.display = this.totalSize > 10 * 1024 * 1024 ? 'block' : 'none';
      }
  
      if (maxUploadPerFileMessage) {
        maxUploadPerFileMessage.style.display = this.largestFileSize > 2 * 1024 * 1024 ? 'block' : 'none';
      }
  
      Promise.all(promises)
        .then((base64Array) => {
          this.place.spaceImage = base64Array[0];
          this.spaceImages = base64Array;
          this.updateSpaceImages();
        })
        .catch((error) => {
          console.error('Error converting files to base64:', error);
        });
    }
  }
  
convertToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}


async updateSpaceImages() {

  const loading = await this.loadingController.create();
  await loading.present();

  const spaceData = {"spaceId" : this.spaceId, "spaceImage" : this.spaceImages, "userId" : this.userId};

  this._apiService.updateImages(spaceData).subscribe(
    (response: any) => {
      if(response.code == '00') {
      loading.dismiss();           
      this.showToast('Space image updated successfully');   
    }
    else {
      loading.dismiss(); 
      this.showToast('Unable to update images. Try again later');             
    }                

    },
    (error: any) => {
      console.error(error);
      loading.dismiss();
      this.showToast('Unable to update images. Try again later');             
      // this.showErrorAlert('Unexpected error occurred');
    }
  );

}


async openContactHostModal() {
  const modal = await this.modalController.create({
    component: ContactHostModalPage,
    breakpoints: [0,5],
    initialBreakpoint: 0.5,
    handle: false,
    componentProps: {
      place: this.place,
    },
  });

  await modal.present();
}

async openTimeModal() {

  const modal = await this.modalCtrl.create({
    component: TimeSlotModalPage,
    breakpoints: [0, 11],
    initialBreakpoint: 0.8,
    handle: false,
    componentProps: {
      availableSlots: this.availableTimeSlots
    }
  });

  await modal.present();

  const { data } = await modal.onDidDismiss();

  if (data && data.startDate && data.startTime && data.endTime) {   
    this.addTimeSlot(data.startDate, data.startTime, data.endTime);
  }
}

addTimeSlot(startDate: any, startTime: any, endTime: any) {
  const newTimeSlot = new TimeSlots(startDate, startTime, endTime);
  this.availableTimeSlots.push(newTimeSlot);
  this.updateTimeSlot(newTimeSlot, 'update');
  this.place.timeSlots.push(newTimeSlot);
  console.log(this.availableTimeSlots);
}

getDayOfWeek(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

async deleteTime(slotToDelete: any) {
  this.place.timeSlots = this.place.timeSlots.filter((slot: any) => slot !== slotToDelete);
  this.updateTimeSlot(slotToDelete, 'delete');
}

async updateTimeSlot(timeSlot: TimeSlots, operation: any) {

  const loading = await this.loadingController.create();
  await loading.present();

  const spaceData = {"spaceId" : this.spaceId, "times" : timeSlot, "operation" : operation};

  this._apiService.updateTimeSlot(spaceData).subscribe(
    (response: any) => {
      if(response.code == '00') {
      loading.dismiss();           
      this.showToast('Time Slots updated successfully');   
    }
    else {
      loading.dismiss(); 
      this.showToast('Unable to update time slots. Try again later');             
    }                

    },
    (error: any) => {
      console.error(error);
      loading.dismiss();
      this.showToast('Unable to update time slots. Try again later');             
    }
  );

}


async moreDetailsModal() {
  const modal = await this.modalController.create({
    component: MoreDetailsModalPage,
    breakpoints: [0,9],
    initialBreakpoint: 1.0,
    handle: false,
    componentProps: {
      place: this.place,
      spaceId: this.spaceId,
    },
  });

  await modal.present();
  const { data } = await modal.onWillDismiss();
  if (data) {
    this.place = data.place;
  }
}


}
