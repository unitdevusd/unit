import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api-service.service';
import { NavController, ToastController } from '@ionic/angular';
import { LoaderService } from '../services/loader-service.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  userDetails: any;
  tenantSpaces: any;
  hostSpaces: any;

  constructor(
    private userService : UserService,
    private apiService : ApiService,
    private toastController : ToastController,
    private _loader: LoaderService,
    private router: Router,
    private navCtrl: NavController,



  ) {}

  ionViewWillEnter() {
    this.userDetails = this.userService.getUserDetails();

    if(this.userDetails?.role === 'TENANT') {
      this.getAllBookedItemsForTenants(this.userDetails?.userId);
    }

    else if(this.userDetails?.role === 'HOST') {
      this.getSpacesForHost(this.userDetails?.userId);
    }
  }

  async getAllBookedItemsForTenants(userId: any) {

    this._loader.present();
    const userData = {"userId" : this.userDetails?.userId};
        this.apiService.fetchTenantSpaces(userData).subscribe(
          (response: any) => {
            this._loader.dismiss();
            if(response !== null) {
              this.tenantSpaces = response;
            }             
          },
          (error: any) => {
            console.error(error);
            this.showToast('Unable to Fetch Spaces');             
          }
        );

  }

  async getSpacesForHost(userId: any) {

    this._loader.present();
    const userData = {"userId" : this.userDetails?.userId};
        this.apiService.viewAllSpacesByUser(userData).subscribe(
          (response: any) => {
            this._loader.dismiss();
            if(response !== null) {
              this.hostSpaces = response;
            }             
          },
          (error: any) => {
            console.error(error);
            this.showToast('Unable to Fetch Spaces');             
          }
        );

  }

  bookSpace() {
    this.router.navigateByUrl(`/tabs`);
  }


  async showToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }


  place(tenantSpaces: any) {
    console.log('Place is '+tenantSpaces.spaceLocation);
    let navigationExtras: NavigationExtras = {
      state: {
        place: tenantSpaces,
        fromTab2: true
      }
    };
    this.router.navigateByUrl(`/space-detail/${tenantSpaces.spaceId}`, navigationExtras);
    // this.router.navigate(['/space-detail', tenantSpaces.spaceId], navigationExtras);

  }

}
