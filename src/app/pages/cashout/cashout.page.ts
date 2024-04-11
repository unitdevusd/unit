import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { UserService } from 'src/app/services/user.service';
import { AddAccountPage } from '../add-account/add-account.page';
import { Stripe } from '@ionic-native/stripe/ngx';
import { AuthModalPage } from '../auth-modal/auth-modal.page';
import { Router } from '@angular/router';
import { PaypalServiceService } from 'src/app/services/paypal-service.service';


@Component({
  selector: 'app-cashout',
  templateUrl: './cashout.page.html',
  styleUrls: ['./cashout.page.scss'],
})
export class CashoutPage implements OnInit {
  userDetails: any;
  userId: any;
  accounts: any;
  balance: number = 0;
  withdrawalAmount: number;
  accountDetail: any;
  firstName: any;
  convertedAmount: any = 0;
  charges: number;

  constructor(
    private userService: UserService,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private modalController: ModalController,
    private toastController: ToastController,
    private stripe: Stripe,
    private router: Router,
    private alertController: AlertController,
    private payPal: PaypalServiceService,
  ) {
    this.userDetails = userService.getUserDetails();
    this.userId = this.userDetails.userId;
    this.balance = userService.getBalance();
    this.firstName = this.userDetails.firstName;
    this.getAccounts();
  }

  ngOnInit() {
  }

  async getAccounts() {

    const userData = { "userId": this.userId };
    console.log(userData);
    const loading = await this.loadingController.create();
    await loading.present();


    this.apiService.fetchAllAccounts(userData).subscribe(
      (response: any) => {
        loading.dismiss();
        console.log(response);
        this.accounts = response;

      },
      (error: any) => {
        console.error(error);
        loading.dismiss();
      }
    );

  }



  async addAccount() {

    const modal = await this.modalController.create({
      component: AddAccountPage,
      breakpoints: [0, 9],
      initialBreakpoint: 1.0,
      handle: false,
      componentProps: {
        userId: this.userId
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data && data.updatedAccounts) {
      console.log(data.updatedAccounts[0].account_number);
      this.accounts = data.updatedAccounts;
      this.showToast('Accounts updated successfully');

    }
  }

  selectAccount(account: any) {
    console.log('In here ' + account);
    this.accountDetail = account;
  }

  async showToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }


  async authenticate() {

    const modal = await this.modalController.create({
      component: AuthModalPage,
      breakpoints: [0, 9],
      initialBreakpoint: 0.6,
      handle: false,
      componentProps: {
        userId: this.userId
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data && data.updatedUser) {
      this.showToast('Successfully validated');
      console.log(this.accountDetail);
      console.log(this.withdrawalAmount);
      this.processPayment(this.accountDetail, (this.convertedAmount - (this.convertedAmount * 0.1)).toFixed(7))

    }
  }



  async processPayment(accounts: any, amount: any) {

    const paymentData = {
      "type": accounts.network,
      "btcAmount": amount,
      "address": accounts.payPalEmail,
      "callback_url": "",
      "userId" : this.userId,
      "usdAmount" : this.withdrawalAmount
    };
    console.log(paymentData);
    const loading = await this.loadingController.create();
    await loading.present();

    this.apiService.makePayment(paymentData).subscribe(
      (response: any) => {
        loading.dismiss();
        console.log(response);

        if (response === 'confirmed') {
          this.showSuccessAlert("This request is currently being processed. Please expect an email");
          this.router.navigateByUrl('/tabs');
        }
        else {
          this.showErrorAlert(response);
        }

      },
      (error: any) => {
        console.error(error);
        loading.dismiss();
        this.showToast('Error transferring funds. Try again later');

      }
    );

  }

  async showErrorAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();

  }

  async showSuccessAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async convert() {

    const loading = await this.loadingController.create();
    await loading.present();
    this.convertedAmount = 0;

    this.apiService.convertToBtc().subscribe(
      (response: string) => {
        loading.dismiss();
        console.log(response);
        console.log(this.withdrawalAmount);

        if (response != null) {
          this.convertedAmount = this.withdrawalAmount * parseFloat(response);
          console.log("BTC Amount:: " + this.convertedAmount);
        }
        else {
          this.showToast("Conversion Failed. Try again later");
        }

      },
      (error: any) => {
        console.error(error);
        loading.dismiss();
        this.showToast('Error transferring funds. Try again later');

      }
    );

  }


  async deleteAccount(accountsId: any) {

    const paymentData = { "bankDetailsId": accountsId };
    console.log(paymentData);
    const loading = await this.loadingController.create();
    await loading.present();

    this.apiService.deleteBankDetails(paymentData).subscribe(
      (response: any) => {
        loading.dismiss();
        console.log(response);

        if (response === 'Deleted') {
          this.showToast("Account Successfully deleted");    
          let indexToRemove = this.accounts.findIndex((item: any) => item.bankDetailsId === accountsId);
          if (indexToRemove !== -1) {
            this.accounts.splice(indexToRemove, 1);
          }      
        }
        else {
          this.showToast("Failed to delete wallet");          
        }

      },
      (error: any) => {
        console.error(error);
        loading.dismiss();
        this.showToast('Error deleting wallet address');

      }
    );



  }

}
