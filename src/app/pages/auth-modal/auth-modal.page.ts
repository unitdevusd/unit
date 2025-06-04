import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.page.html',
  styleUrls: ['./auth-modal.page.scss'],
})
export class AuthModalPage implements OnInit {

  password: string;
  userDetails: any;
  email: any;

  constructor(
    private userService : UserService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private modalController: ModalController,
    private apiService: ApiService
  ) { 
    this.userDetails = userService.getUserDetails();
    this.email = this.userDetails.email;
  }

  ionViewWillEnter() {
    this.sendOtp();
  }
  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();

  }

  async sendOtp() {

    const loading = await this.loadingController.create();
    await loading.present();
    const loginData = {"email" : this.userService.encrypt(this.email)};

    this.apiService.validateEmail(loginData).subscribe(
      (response: any) => {
        loading.dismiss();
        this.showErrorAlert(response.message);
      },
      (error: any) => {
        console.error(error);
        loading.dismiss();
        this.showErrorAlert('Unexpected error occurred');
      }
    );
  }

async validate() {

  try {
    const loading = await this.loadingController.create();
    await loading.present();

      const loginData = {"email" : this.email, "otp" : this.password};

      await this.authService.validateOtp(loginData).subscribe(
        (response: any) => {
          loading.dismiss();

          if (response.code == '00') {
            this.modalController.dismiss({ updatedUser: response });

          } else {
            this.showErrorAlert(response.message);    
          }
        },
        (error: any) => {
          console.error(error);
          loading.dismiss();
          this.showErrorAlert('Unexpected error occurred');
        }
      );
  } catch (error) {
    console.error(error);
  }
}

async showErrorAlert(message: any) {
  const alert = await this.alertController.create({
    header: 'Success',
    message: message,
    buttons: ['OK']
  });

  await alert.present();

}


}
