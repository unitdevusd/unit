import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { ContactHostModalPage } from '../contact-host-modal/contact-host-modal.page';
import { StripeService } from 'src/app/services/stripe.service';
import { UserService } from 'src/app/services/user.service';



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
  ) { 
    this.userDetails = this.userService.getUserDetails();
    this.userId = this.userDetails?.userId;

    this.spaceId = this.route.snapshot.paramMap.get('spaceId');
    this.getSpaceById();
    // const url = `https://www.google.com/maps/embed/v1/view?key=AIzaSyCZme7cYLG7jnK4Cn8ZFnQJDUKPNwIsfqI&center=41.8781136,-87.6297982&zoom=15&output=embed`;
    const url = `https://maps.google.com/maps?q=41.8781136,-87.6297982&z=10&output=embed`;

    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);


  }

  ngOnInit() {
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
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  pay(amount: any) {
    this.stripeService.pay(amount);
    this.bookSpace();
  }


async bookSpace() {
  const spaceData = {"spaceId" : this.spaceId, "bookingStatus" : "BOOKED", "userId" : this.userDetails?.userId};
  this._apiService.bookSpace(spaceData).subscribe(
    (response: any) => {
      console.log(response.message);
      this.bookingButtonText = 'Successfully booked';
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




}