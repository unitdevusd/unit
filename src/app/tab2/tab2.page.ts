import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api-service.service';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { LoaderService } from '../services/loader-service.service';
import { NavigationExtras, Router } from '@angular/router';
import { ImageModalPage } from '../pages/image-modal/image-modal.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  userDetails: any;
  tenantSpaces: any;
  hostSpaces: any;
  allUsers: any;
  role: any;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  filteredUsers: any[] = [];

  constructor(
    private userService : UserService,
    private apiService : ApiService,
    private toastController : ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private navCtrl: NavController,
    private alertController: AlertController,
    private modalController: ModalController,



  ) {}

  ionViewWillEnter() {
    this.userDetails = this.userService.getUserDetails();
    this.role = this.userDetails?.role;

    if(this.userDetails?.role === 'TENANT') {
      this.getAllBookedItemsForTenants(this.userDetails?.userId);
    }

    else if(this.userDetails?.role === 'HOST') {
      this.getSpacesForHost(this.userDetails?.userId);
    }

    else if(this.userDetails?.role === 'ADMIN') {
      this.getAllusers(this.userDetails?.userId);
    }
  }



  async getAllusers(userId: any) {

    const loading = await this.loadingController.create();
    await loading.present();
    const userData = {"userId" : this.userDetails?.userId};
        this.apiService.fetchUsers(userData).subscribe(
          (response: any) => {
            loading.dismiss();
            if(response !== null) {
              this.allUsers = response;
            }             
          },
          (error: any) => {
            loading.dismiss();
            console.error(error);
            this.showToast('Unable to Fetch Users');             
          }
        );

  }


  async getAllBookedItemsForTenants(userId: any) {

    const loading = await this.loadingController.create();
        await loading.present();
    const userData = {"userId" : this.userDetails?.userId};
        this.apiService.fetchTenantSpaces(userData).subscribe(
          (response: any) => {
            loading.dismiss();
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

    const loading = await this.loadingController.create();
    await loading.present();
    const userData = {"userId" : this.userDetails?.userId};
        this.apiService.viewAllSpacesByUser(userData).subscribe(
          (response: any) => {
            loading.dismiss();
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

  async disableUser(userId: any, text: any) {
    const loading = await this.loadingController.create();
    await loading.present();

    const userData = {"userId" : userId, "initiatorId" : this.userDetails?.userId};
        this.apiService.modifyUser(userData).subscribe(
          (response: any) => {
            loading.dismiss();
            if(response !== null) {
              this.allUsers = response;
              this.showToast(text+' done successfully');
            
            }       
          },
          (error: any) => {
            loading.dismiss();
            console.error(error);
            this.showToast('Unable to Modify User');             
          }
        );
  }

  clearAutocomplete() {
    this.autocompleteItems = []
    this.autocomplete.input = '';
  }


  searchUsers(event: any) {
    const searchTerm = (event.target.value || '').toLowerCase();
    this.filteredUsers  = this.allUsers.filter((user: { fullName: string; }) =>
      user.fullName.toLowerCase().includes(searchTerm)
    );

    if(searchTerm == '') {
      this.filteredUsers = this.allUsers.slice();
    }
  }

  searchLocation() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
 
  }

  async openImageModal(imageUrl: string) {
    const modal = await this.modalController.create({
      component: ImageModalPage,
      breakpoints: [0,5],
      initialBreakpoint: 0.5,
      handle: false,
      componentProps: {
        imageUrl: imageUrl
      }
    });
  
    await modal.present();
  }



  async confirmDelete(user: any) {
    var message = '';
    var header = '';
    var text = '';
    if(user.active == true) {
      message = 'Are you sure you want to disable this user?';
      header = 'Confirm Disabling';
      text = 'Disable';
    }
    else {
      message = 'Are you sure you want to enable this user?';
      header = 'Confirm Enabling';
      text = 'Enable';
    }
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: text,
          handler: () => {
            this.disableUser(user.userId, text);
          }
        }
      ]
    });
  
    await alert.present();
  
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
