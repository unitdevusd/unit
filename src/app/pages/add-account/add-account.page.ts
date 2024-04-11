import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.page.html',
  styleUrls: ['./add-account.page.scss'],
})
export class AddAccountPage implements OnInit {
  public accountForm!: FormGroup;
  userDetails: any;
  userId: any;
  firstName: any;


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private alertController: AlertController,
    private modalController: ModalController,

  ) { 

    this.userDetails = this.userService.getUserDetails();
    this.userId = this.userDetails?.userId;
    this.firstName = this.userDetails?.firstName || 'Guest';


    this.accountForm = this.formBuilder.group({
      payPayEmail: new FormControl("", Validators.required),
      network: new FormControl("", Validators.required),
      userId: this.userId,
    });

  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();

  }


  async addAccount() {

    try {
      const loading = await this.loadingController.create();
      await loading.present();
  
      if (this.accountForm.value) {
        const accountData = this.accountForm.value;
        console.log(accountData);
        this.apiService.addAccount(accountData).subscribe(
          (response: any) => {
            loading.dismiss();
            console.log('Response is '+response[0].account_number);
        
            if(response != null) {
              this.modalController.dismiss({ updatedAccounts: response });
            }
            else {
              this.showErrorAlert('Account not saved. Please try again');
            }

  
          },
          (error: any) => {
            console.error(error);
            loading.dismiss();
            this.showErrorAlert('Account not saved. Please try again');
          }
        );
      }
    } catch (error) {
      console.error(error);
      this.showErrorAlert('Unexpected error occurred');
    }
  }


  async showErrorAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

  }
}
