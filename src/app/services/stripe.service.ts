import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private handler: any;


  constructor(
    private alertController: AlertController,
  ) { 
    this.loadStripe();
  }


  
  // pay(amount: any) {
  //   this.handler.open({
  //     name: 'Demo Site',
  //     description: '2 widgets',
  //     amount: amount * 100
  //   });
  // }

  pay(amount: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.handler.open({
        name: 'Demo Site',
        description: '2 widgets',
        amount: amount * 100,
        token: (token: any) => {
          console.log(token);
          this.showSuccessAlert('Payment Successful');
          resolve();
        },
        closed: () => {
          // Handle closure of the payment form
          // You can reject the promise here if needed
          reject(new Error('Payment form closed'));
        },
      });
    });
  }
  

  private loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51OJq1MIa2Zt80Jvhh1zBVKaiG3t46oKxwAPp0b8QjMVlZBFZsfV2QV7VWYVUUtw3paJskmCsO6AoJeU09mkhmY1f00LtYcxFyh',
          locale: 'auto',
          token: (token: any) => {
            console.log(token);
            this.showSuccessAlert('Payment Successful');
          }
        });
      };
      window.document.body.appendChild(script);
    }
  }

  async showSuccessAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
      buttons: ['OK']
    });
}

}



