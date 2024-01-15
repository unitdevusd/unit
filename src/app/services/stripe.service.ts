import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private handler: any;
  private baseUrl = 'https://unitsession.com/';
  // private baseUrl = 'http://localhost:8088/';
  private processPayment = this.baseUrl+'payment/process-payment';



  constructor(
    private alertController: AlertController,
    public http: HttpClient,
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
        name: 'Unit Session',
        description: 'Payment page',
        amount: amount * 100,
        token: (token: any) => {
          console.log('Token1 from pay is '+token.id);
          this.showSuccessAlert('Payment Successful');
          resolve(token.id);
        },
        closed: () => {
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
          key: 'pk_live_51OJq1MIa2Zt80JvhtpGP4jmOaCsE9jVOlVWUzZKOvUFZUkXh4PoTJ1BIJkPiMMyQ2tFuZFCOU4IhpWhQkiJbgEVv00kGiX1sWC',
          locale: 'auto',
          token: (token: any) => {
            // this.showSuccessAlert('Payment Successful');
            // resolve();
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


async sendTokenToBackend(token: any, amount: any): Promise<string> {
  const url = `${this.processPayment}/?tokenId=${token}&amount=${amount}`;

  try {
    const response = await this.http.post(url, {}, { responseType: 'text' }).toPromise();

    console.log('Backend response:', response);
    return response;
  } catch (error) {
    console.error('Error sending token to backend:', error);
    throw error;
  }
}
}



