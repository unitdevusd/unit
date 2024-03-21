import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
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
  ) { 
    this.userDetails = userService.getUserDetails();
    this.email = this.userDetails.email;
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();

  }

async validate() {

  try {
    const loading = await this.loadingController.create();
    await loading.present();

      const loginData = {"email" : this.email, "password" : this.password};

      await this.authService.authenticateUser(loginData).subscribe(
        (response: any) => {
          loading.dismiss();

          if (response.email) {
            this.modalController.dismiss({ updatedUser: response });

          } else {
            this.showErrorAlert('Wrong Password.');    
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
    header: 'Error',
    message: message,
    buttons: ['OK']
  });

  await alert.present();

}


}
