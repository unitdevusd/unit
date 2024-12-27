import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api-service.service';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { ImageModalPage } from '../pages/image-modal/image-modal.page';
import { Capacitor } from '@capacitor/core';
import { v4 as uuidv4 } from 'uuid';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { AuthService } from '../services/auth.service';
import { CrewNameModalComponent } from '../component/crew-name-modal/crew-name-modal.component';




@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  firstName: any;
  role: any;
  userId: any;
  darkMode = false;
  userDetails: any;
  hostToggle: boolean = false;
  tenantToggle: boolean = false;
  profilePicture: any;
  fromTab3: boolean = false;
  referralCode: any;
  biometrics: boolean = false;


  constructor(
    private userService: UserService,
    private auth: AuthService,
    private apiService: ApiService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
    private modalController: ModalController,
    private loadingController: LoadingController,

  ) { }

  ionViewWillEnter() {
    this.findProfilePic();
    this.userDetails = this.userService.getUserDetails();
    this.firstName = this.userDetails?.firstName || 'Guest';
    this.role = this.userDetails?.role;
    this.referralCode = this.userDetails?.referralCode;
    this.userId = this.userDetails?.userId;
    this.biometrics = this.userDetails?.biometrics;
    this.hostToggle = false;
    this.tenantToggle = false;





  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  toggleRole(realRole: any) {
    this.role = realRole;
    console.log('Before toggle role is ' + this.role);
    this.role = this.role === 'HOST' ? 'TENANT' : 'HOST';
    console.log('New role is ' + this.role);
    this.updateRole();
  }

  async showToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  async showErrorAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

  }

  async openImageModal(imageUrl: string) {
    const modal = await this.modalController.create({
      component: ImageModalPage,
      breakpoints: [0, 9],
      initialBreakpoint: 0.6,
      handle: false,
      componentProps: {
        imageUrl: imageUrl,
        fromTab3: true
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data && data.updatedUser) {
      this.userService.setUserDetails(data.updatedUser);
      this.userDetails = data.updatedUser;
      this.profilePicture = data.updatedUser.profilePicture;
      this.showToast('Profile picture updated successfully');

    }

  }


  async findProfilePic() {

    const loading = await this.loadingController.create();
    await loading.present();

    const userData = { "userId": this.userId };
    this.apiService.findProfilePic(userData).subscribe(
      (response: any) => {
        loading.dismiss();

        if (response !== null) {
          this.profilePicture = response;
        }

        else {
          this.showErrorAlert('Unable to load profile picture');
        }

      },
      (error: any) => {
        loading.dismiss();
        console.error(error);
        this.showToast('Unable to load profile picture');
      }
    );
  }

  logout() {
    this.userService.clearUserDetails();
    this.auth.logout();
    this.router.navigate(['/login']);
  }



  async openCrewNameModal() {
    const modal = await this.modalController.create({
      component: CrewNameModalComponent,
      breakpoints: [0,0.5,1],
      initialBreakpoint: 0.6,
      handle: true,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.setCrewName(result.data.crewName)
      }
    });

    return await modal.present();
  }

  async setCrewName(name: string) {
    const loading = await this.loadingController.create();
    await loading.present();
    const crewData = {"crewName" : name, "userId": this.userId};
        this.apiService.setCrewName(crewData).subscribe(
          (response: any) => {
            loading.dismiss();
            if(response.code == '00') {
              this.userDetails.crewName = name;
              this.userService.setUserDetails(this.userDetails);
            }
            this.showToast(response.message);
          },
          (error: any) => {
            console.error(error);
            loading.dismiss();
            this.showToast('Unable to set crew name');             
          }
        );

  }

  async updateRole() {

    const userData = { "userId": this.userId, "role": this.role };
    this.apiService.updateUserRole(userData).subscribe(
      (response: any) => {

        if (response !== null) {
          this.userService.setUserDetails(response);
          // this.showToast('You are now a '+this.role);
          if (this.role === 'TENANT') {
            this.showToast('You are now a Dancer');
          } else {
            this.showToast('You are now a Host');
          }
          // this.router.navigateByUrl('/tabs');               
          let navigationExtras: NavigationExtras = {
            state: {
              navigationData: true
            }
          };
          this.router.navigateByUrl(`/tabs`, navigationExtras);

        }

        else {
          this.showErrorAlert('Unable to change roles');
        }

      },
      (error: any) => {
        console.error(error);
        this.showToast('Unable to switch roles');
      }
    );
  }

  async copyToClipboard(referralCode: string) {
    try {
      await navigator.clipboard.writeText(referralCode);
      this.showToast('Referral code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  async toggleBiometrics() {
    if (Capacitor.isNativePlatform()) {
      
      let deviceUUID = localStorage.getItem('deviceUUID');

      if (!deviceUUID) {
        deviceUUID = uuidv4();
        localStorage.setItem('deviceUUID', deviceUUID);
        await SecureStoragePlugin.set({ key: 'deviceUUID', value: deviceUUID });
      }

      if (deviceUUID != null) {
        const biometricData = { "userId": this.userId, "biometrics" : this.biometrics, "deviceId": deviceUUID };
        const loading = await this.loadingController.create();
        await loading.present();

    this.apiService.toggleBiometrics(biometricData).subscribe(
      (response: any) => {
        loading.dismiss();

        if (response.code == '00') {
          this.showToast('Biometrics setting modified successfully');
          this.userDetails.biometrics = this.biometrics;
          this.userService.setUserDetails(this.userDetails);
        }
        else {
          this.showToast('Failed to modify biometrics');
        }
      },
      (error: any) => {
        loading.dismiss();
        console.error(error);
        this.showToast('Unable to modify biometrics settings');
      }
    );
      }
    }
  }
}
