import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonInput, LoadingController, ModalController, PickerController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { ContactHostModalPage } from '../contact-host-modal/contact-host-modal.page';
import { StripeService } from 'src/app/services/stripe.service';
import { UserService } from 'src/app/services/user.service';
import { MoreDetailsModalPage } from '../more-details-modal/more-details-modal.page';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { loadStripe } from '@stripe/stripe-js';
import { ImageModalPage } from '../image-modal/image-modal.page';


declare var paypal: any;

@Component({
  selector: 'app-space-detail',
  templateUrl: './space-detail.page.html',
  styleUrls: ['./space-detail.page.scss'],
})
export class SpaceDetailPage implements OnInit {

  title = 'angular-stripe';
  priceId = 'price_1HSxpTFHabj9XRH6DMA8pC7l';
  product = {
    title: 'Classic Peace Lily',
    subTitle: 'Popular House Plant',
    description: 'Classic Peace Lily is a spathiphyllum floor plant arranged in a bamboo planter with a blue & red ribbom and butterfly pick.',
    price: 18.00
  };
  quantity = 1;
  stripePromise = loadStripe('pk_test_51OJq1MIa2Zt80Jvhh1zBVKaiG3t46oKxwAPp0b8QjMVlZBFZsfV2QV7VWYVUUtw3paJskmCsO6AoJeU09mkhmY1f00LtYcxFyh');

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
  rentCharges: number = 0;
  serviceCharges: number = 0;
  totalFees: number = 0;
  fromTab2: boolean = false;
  role: any;
  isPayPalButtonRendered = false;
  hoursDifference: any = 0;

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
    private alertController: AlertController,

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
    this.role = this.userDetails?.role;
    this.userId = this.userDetails?.userId;
    this.spaceId = this.route.snapshot.paramMap.get('spaceId');
    this.fromTab2 = history.state.fromTab2;
    if (this.fromTab2) {
      console.log('From Tab 2');
      this.bookingButtonText = 'Book Again'
    }

        const url = `https://maps.google.com/maps?q=41.8781136,-87.6297982&z=10&output=embed`;   
        this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    

    this.getSpaceById();

   
    

  }

  ngOnInit() {
    this.calculateHours();
  }


  async getSpaceById() {

    try {
      const loading = await this.loadingController.create();
      await loading.present();
  
      if (this.spaceId) {
        const spaceData = {"spaceId" : this.spaceId};
        this._apiService.getSpaceBySpaceId(spaceData).subscribe(
          (response: any) => {
            loading.dismiss();
            this.place = response;
            const url = `https://maps.google.com/maps?q=${this.place.lat},${this.place.lng}&z=10&output=embed`;
            this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        
            this.fromTab2 ? this.bookingButtonText = 'Book Again' : this.bookingButtonText = 'Click to book space';
            // this.bookingButtonText = 'Click to book space'
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



  async pay(amount: number) {
    const currentHours = this.hoursForm.get('hoursValue')!.value;
    const loading = await this.loadingController.create();
    if(currentHours === "" || currentHours === "0") {
      this.showToast('Enter hours needed');
    }

    else {
      await loading.present();
      try {
        if(amount == 0) {
          this.bookSpace();
        }
        else {
          const token: any = await this.stripeService.pay(amount);
          const response: any = await this.stripeService.sendTokenToBackend(token, amount);  
          loading.dismiss();
          console.log('Response is ' + response);
  
          if (response.startsWith('Payment successful')) {
              this.showSuccessAlert('Payment successful');
              this.bookSpace();

          } else {
              this.showErrorAlert(response);
          }

        }
  
      } catch (error) {
          // Handle payment error
          loading.dismiss();
          console.error('Payment failed:', error);
          this.showErrorAlert('Payment Failed');
      } finally {
          loading.dismiss();
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


async openImageModal(imageUrl: string) {
  const modal = await this.modalController.create({
    component: ImageModalPage,
    breakpoints: [0,9],
    initialBreakpoint: 0.6,
    handle: false,
    componentProps: {
      imageUrl: imageUrl
    }
  });

  await modal.present();
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
    this.hoursDifference = 0;
    if (this.startDateTime && this.endDateTime) {
      const startDate = new Date(this.startDateTime);
      const endDate = new Date(this.endDateTime);
      // console.log('Start date is '+startDate);
      // console.log('End date is '+endDate);
      const timeDifference = endDate.getTime() - startDate.getTime();
      this.hoursDifference = Math.ceil(timeDifference / (1000 * 60 * 60));
      
      if(this.hoursDifference <= 0) {
        this.showToast('Please enter a valid duration');
      }


      else if(this.hoursDifference > 1) {

        this.rentCharges = this.place?.chargePerDay * this.hoursDifference || 0;
        console.log(this.place?.chargePerDay);
        this.serviceCharges = this.rentCharges * 0.1;
        console.log(this.serviceCharges);
        this.totalFees = this.rentCharges + this.serviceCharges;
  
        this.showToast('Space will be booked for '+this.hoursDifference+' hours');
      }
      else {

        this.rentCharges = this.place?.chargePerDay * this.hoursDifference || 0;
        console.log(this.place?.chargePerDay);
        this.serviceCharges = this.rentCharges * 0.1;
        console.log(this.serviceCharges);
        this.totalFees = this.rentCharges + this.serviceCharges;
  
        this.showToast('Space will be booked for '+this.hoursDifference+' hour');
      }


      const hoursValueControl = this.hoursForm.get('hoursValue');
      const startDateTimeForm = this.hoursForm.get('startDateTime');
      const endDateTimeForm = this.hoursForm.get('endDateTime');

      if (hoursValueControl && startDateTimeForm && endDateTimeForm) {
        hoursValueControl.setValue(this.hoursDifference);
        startDateTimeForm.setValue(startDate);
        endDateTimeForm.setValue(endDate);
      }

      console.log('Number of hours between the selected dates/times:', this.hoursDifference);
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

    this._apiService.removeSpace(spaceData).subscribe(
      (response: any) => {
        if(response == 'Deleted') {
        loading.dismiss();           
        this.router.navigateByUrl('/tabs', { replaceUrl: true }); 
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



  initPayPalButton(amount: any) {
    if (!this.isPayPalButtonRendered) {
      paypal.Buttons({
        createOrder: (_data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount // Set the payment amount
              }
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            // Payment successful, handle further actions
            console.log('Transaction completed by ' + details.payer.name.given_name);
            this.showSuccessAlert('Payment successful');
            this.bookSpace();
          });
        },
        onError: (err: any) => {
          // Handle payment error
          this.showErrorAlert(err);
          console.error('PayPal payment error:', err);
        }
      }).render('#paypal-button-container'); // Render PayPal button in specified container
      
      this.isPayPalButtonRendered = true; // Set flag to true after rendering
    }
  }

}
