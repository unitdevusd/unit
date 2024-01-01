import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput, LoadingController, ModalController, PickerController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { ContactHostModalPage } from '../contact-host-modal/contact-host-modal.page';
import { StripeService } from 'src/app/services/stripe.service';
import { UserService } from 'src/app/services/user.service';
import { MoreDetailsModalPage } from '../more-details-modal/more-details-modal.page';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-space-detail',
  templateUrl: './space-detail.page.html',
  styleUrls: ['./space-detail.page.scss'],
})
export class SpaceDetailPage implements OnInit {

  public sanitizedUrl: SafeResourceUrl;
  spaceId: any;
  place: any;
  owner: any;
  nodescription: boolean;
  bookingButtonText: string;
  userDetails: any;
  userId: any;
  hoursForm: FormGroup;
  customPickerOptions: any;
  startDateTime: string;
  endDateTime: string;
  startDateTimeInput: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _apiService: ApiService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private sanitizer: DomSanitizer,
    private modalController: ModalController,
    private stripeService: StripeService,
    private userService : UserService,
    private formBuilder: FormBuilder,
    private pickerController: PickerController,
  ) { 
    this.hoursForm = this.formBuilder.group({
      // hoursValue: ['', [Validators.required, Validators.pattern('^[0-9]*$')], disabled: true],
      hoursValue: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]*$')]),
      startDateTime: new FormControl(''),
      endDateTime: new FormControl(''),

    });

    // this.startDateTime = new Date().toISOString();
    // this.endDateTime = new Date().toISOString();
    this.userDetails = this.userService.getUserDetails();
    this.userId = this.userDetails?.userId;
    this.spaceId = this.route.snapshot.paramMap.get('spaceId');
    this.getSpaceById();
    const url = `https://maps.google.com/maps?q=41.8781136,-87.6297982&z=10&output=embed`;
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);


    // this.customPickerOptions = {
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //     },
    //     {
    //       text: 'Done',
    //       handler: () => {
    //         // Handle the done button click if needed
    //       },
    //     },
    //   ],
    // };

    

  }

  ngOnInit() {
    this.calculateHours();
  }


  async getSpaceById() {

    try {
      console.log('Retrieving list of spaces around me')
      const loading = await this.loadingController.create();
      await loading.present();
  
      if (this.spaceId) {
        const spaceData = {"spaceId" : this.spaceId};
        this._apiService.getSpaceBySpaceId(spaceData).subscribe(
          (response: any) => {
            loading.dismiss();
            this.place = response;
            this.bookingButtonText = 'Click to book space'
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


  async showToast(message: any) {

    setTimeout(async () => {
      const toast = await this.toastController.create({
        message: message,
        duration: 4000,
        position: 'bottom',
        cssClass: 'centered-toast',
      });
      toast.present();
  
    }, 3000);

  }



  pay(amount: number) {
    const currentHours = this.hoursForm.get('hoursValue')!.value;
    if(currentHours === "" || currentHours === "0") {
      console.log('Hour is blank');
      this.showToast('Enter hours needed');
    }

    else {
    console.log('Current hour is ' + currentHours);
    this.stripeService.pay(amount * currentHours)
      .then(() => {
        this.bookSpace();
      })
      .catch((error: Error) => {
        // Handle payment error
        console.error('Payment failed:', error);
      });
    }
  }





async bookSpace() {
  const spaceData = {"spaceId" : this.spaceId, "bookingStatus" : "BOOKED", "duration" : this.hoursForm.get('hoursValue')!.value, "userId" : this.userDetails?.userId, 
  "startDateTime" : this.hoursForm.get('startDateTime')!.value,
  "endDateTime" : this.hoursForm.get('endDateTime')!.value};
  this._apiService.bookSpace(spaceData).subscribe(
    (response: any) => {
      console.log(response.message);
      this.bookingButtonText = 'Successfully booked';
      setTimeout(() => {
        this.router.navigateByUrl('/tabs');
      }, 2000);
    },
    (error: any) => {
      console.error(error);
      this.showToast('Unable to book space');             
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


  async moreDetailsModal() {
    const modal = await this.modalController.create({
      component: MoreDetailsModalPage,
      breakpoints: [0,5],
      initialBreakpoint: 0.5,
      handle: false,
      componentProps: {
        place: this.place,
      },
    });
  
    await modal.present();
  }



  calculateHours() {
    if (this.startDateTime && this.endDateTime) {
      const startDate = new Date(this.startDateTime);
      const endDate = new Date(this.endDateTime);
      console.log('Start date is '+startDate);
      console.log('End date is '+endDate);
      const timeDifference = endDate.getTime() - startDate.getTime();
      const hoursDifference = Math.ceil(timeDifference / (1000 * 60 * 60));
      
      if(hoursDifference <= 0) {
        this.showToast('Please enter a valid duration');
      }

      else if(hoursDifference > 1) {
        this.showToast('Space will be booked for '+hoursDifference+' hours');
      }
      else {
        this.showToast('Space will be booked for '+hoursDifference+' hour');
      }


      const hoursValueControl = this.hoursForm.get('hoursValue');
      const startDateTimeForm = this.hoursForm.get('startDateTime');
      const endDateTimeForm = this.hoursForm.get('endDateTime');

      if (hoursValueControl && startDateTimeForm && endDateTimeForm) {
        hoursValueControl.setValue(hoursDifference);
        startDateTimeForm.setValue(startDate);
        endDateTimeForm.setValue(endDate);
      }

      console.log('Number of hours between the selected dates/times:', hoursDifference);
    }
  }




}
