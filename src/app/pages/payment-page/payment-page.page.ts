import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { IonModal, LoadingController, ModalController, NavController, NavParams, ToastController } from '@ionic/angular';
import { Subject, Subscription, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api-service.service';
import { UserService } from 'src/app/services/user.service';


interface TimeSlot {
  date: string; // format: 'YYYY-MM-DD'
  startTime: string; // format: 'HH:mm'
  endTime: string; // format: 'HH:mm'
}

declare var paypal: any;


@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.page.html',
  styleUrls: ['./payment-page.page.scss'],
})
export class PaymentPagePage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;
  place: any;

  dateExample: any;
  selectedTimeSlots: TimeSlot[] = [];
  filteredTimeSlots: TimeSlot[] = [];
  rentCharges: number = 0;
  serviceCharges: number = 0;
  totalFees: number = 0;
  hoursDifference: number = 0;
  userDetails: any;
  TRACKING_INTERVAL_MS = 10000;
  intervalSubscription: Subscription | undefined;
  startTime: any;
  endTime: any;
  startDate: any;
  bookingButtonText: any;
  isPayPalButtonRendered = false;


  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private userService : UserService,
    private loadingController: LoadingController,
    private _apiService: ApiService,
    private router: Router,

  ) {
    this.userDetails = this.userService.getUserDetails();
    this.bookingButtonText = 'Process Payment($'+this.totalFees+')';
   }

  ngOnInit() {
    const navigationState = history.state;  

    if (navigationState && navigationState.place) {
      this.place = navigationState.place;
    }
    console.log(this.place);

    this.place.timeSlots = this.place.timeSlots.map((slot: { date: string; }) => ({
      ...slot,
      date: this.formatDateToISO(slot.date),
    }));
    this.dateExample = this.isDateEnabled(this.place.timeSlots[0]?.date) ? this.place.timeSlots[0]?.date : '';

    this.filteredTimeSlots = this.place.timeSlots.filter(
      (timeSlot: TimeSlot) => timeSlot.date === this.dateExample
    );
 
  }

  closeModal() {
    this.modal.dismiss();
  }

  ngOnDestroy() {
    this.place = null;

    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    }

    loadPayPalScript() {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AYPddTXdQ61Y1FfQNVjjEVQrhfEN6ygOR7UG6KSj5_jMIPi9CWbjF5yZDJo4VNbAFTcpIWm5YW_qFuEv&components=buttons';
      script.onload = () => {
        console.log('PayPal SDK loaded');
      };
      document.body.appendChild(script);
  }

formatDateToISO(dateString: string): string {
  const [month, day, year] = dateString.split('/');
  const isoDate = new Date(Date.UTC(+year, +month - 1, +day));
  return isoDate.toISOString().split('T')[0];
}

selectTimeSlot(event: any, timeSlot: TimeSlot) {
  console.log(timeSlot);
  this.selectedTimeSlots.splice(0, this.selectedTimeSlots.length);
  if (event.detail.checked) {
    this.selectedTimeSlots.push(timeSlot);
    this.dismissModal();
  } else {
    const index = this.selectedTimeSlots.findIndex(slot => slot === timeSlot);
    if (index !== -1) {
      this.selectedTimeSlots.splice(index, 1);
      console.log('Updated selected time slots:', this.selectedTimeSlots);
    }
  }
  this.calculateHours(timeSlot);
}

onDateChange() {
  this.filteredTimeSlots = this.place.timeSlots.filter(
    (timeSlot: TimeSlot) => timeSlot.date === this.dateExample
  );
  console.log(this.filteredTimeSlots);
}

isDateEnabled(date: string): boolean {
  const today = new Date().toISOString().split('T')[0];

  if (date < today) {
    return false;
  }
  return this.place.timeSlots.some((timeSlot: { date: string; }) => timeSlot.date === date);
}


calculateHours(slots: any) {
  this.hoursDifference = 0;
  const startTime = new Date(`1970-01-01T${slots.startTime}`);
  const endTime = new Date(`1970-01-01T${slots.endTime}`);
  
  const timeDifference = endTime.getTime() - startTime.getTime();

      
  this.hoursDifference = Math.ceil(timeDifference / (1000 * 60 * 60));
    
    if(this.hoursDifference <= 0) {
      this.showToast('Please enter a valid duration');
    }


    else if(this.hoursDifference > 0) {
      this.endTime = endTime.getTime();
      this.startTime = startTime.getTime();

      if(this.place?.hourlyCharges) {
      this.rentCharges = this.place?.chargePerDay * this.hoursDifference || 0;
      }
      else {
        this.rentCharges = this.place?.chargePerDay|| 0;  
      }

      this.serviceCharges = this.rentCharges * 0.1;
      this.totalFees = this.rentCharges + this.serviceCharges;
      this.bookingButtonText = 'Process Payment($'+this.totalFees+')';
      this.showToast('Space will be booked for '+this.hoursDifference+' hours');
    }
    else {

      this.rentCharges = this.place?.chargePerDay * this.hoursDifference || 0;
      this.serviceCharges = this.rentCharges * 0.1;
      this.totalFees = this.rentCharges + this.serviceCharges;
      this.bookingButtonText = 'Process Payment($'+this.totalFees+')';
      this.showToast('Space will be booked for '+this.hoursDifference+' hour');
    }


    console.log('Number of hours between the selected dates/times:', this.hoursDifference);
}

async showToast(message: any) {

  setTimeout(async () => {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      position: 'bottom',
      cssClass: 'centered-toast',
    });
    toast.present();

  }, 3000);

}




async sendCrypto(amount: any) {

  const paymentData = {"amount" : amount, "currency" : "USD", "description" : "Payment from "+this.userDetails?.fullName,
  "customer_name" : this.userDetails?.fullName, "customer_email" : this.userDetails?.email,
  "order_id" : "", "callback_url" : "", "success_url" : ""};

  const loading = await this.loadingController.create();
  await loading.present();


  this._apiService.generateCharges(paymentData).subscribe(
    (response: any) => {
      if(response != null) {
      loading.dismiss();  
      this.showToast('Checkout page to be opened'); 
      const checkoutUrl = 'https://checkout.opennode.com/' + response;      
      this.openExternalURL(checkoutUrl);

      // this.trackIdInterval = setInterval(() => {
      //   this.trackId(response);
      // }, 7000);  
      this.startIntervalOperation(10000, response);



    }
    else {
      loading.dismiss(); 
      this.showToast('Unable to generate checkout ID. Try again later');             
    }                

    },
    (error: any) => {
      console.error(error);
      loading.dismiss();
      this.showToast('Unable to generate checkout ID. Try again later');             
    }
  );
}


async openExternalURL(url: string) {
  if (Capacitor.isNativePlatform()) {
    await Browser.open({url: url});
  } else {
    window.open(url, '_blank');
  }
}


startIntervalOperation(intervalTime: number, id: any) {
  if (this.intervalSubscription) {
    this.intervalSubscription.unsubscribe();
  }

  const completionSubject = new Subject<void>();
  let intervalsCompleted = 0;

  this.intervalSubscription = interval(intervalTime).pipe(
    takeUntil(completionSubject),
  ).subscribe(() => {
    intervalsCompleted++;
    this.trackId(id);

    if (intervalsCompleted >= 20) {
      completionSubject.next(); 
      completionSubject.complete();
    }
  });

  completionSubject.subscribe(() => {
    this.showToast('We did not receive any payment from you. Please try again');
    // this.bookingButtonText = 'Click to book space';
    console.log('All operations completed');
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  });
}



async trackId(id: string) {
  console.log('In here again');
  

  try{

    const loading = await this.loadingController.create(
      {
        message: "Confirming payment. Please wait",
        backdropDismiss: true
      }
    );
    await loading.present();

    const paymentData = {"id" : id};
    this._apiService.trackCharges(paymentData).subscribe(
      (response: any) => {   
        if (response === 'paid') {
          this.intervalSubscription?.unsubscribe();
          this.bookSpace(id, response);
          this.showToast("Transfer successful and space booked. Thank you for booking");
        }     
        console.log('Processed tracking response: ' + response);
        loading.dismiss();
        // this.bookingButtonText = response;
      },
      (error: any) => {
        loading.dismiss();
        this.intervalSubscription?.unsubscribe();
        console.error('Error tracking charges:', error);
      }
    );
  }catch(error) {
    console.error('Error '+error);
  }

}

async payWithBonus(amount: number) {
  const totalBonus = this.userDetails?.bonus;
  console.log(totalBonus);

  if(totalBonus < amount) {
    this.showToast('Insufficient bonus to book space');
    return;
  }
  await this.bookSpace('bonus-payment', 'PAID');
}


async bookSpace(id: any, status: any) {
  const loading = await this.loadingController.create();
  await loading.present();
  const newStart = new Date(this.startTime);
  const newEnd = new Date(this.endTime);
  let startDateTime = new Date(this.dateExample);


  const spaceData = {"spaceId" : this.place.spaceId, 
  "bookingStatus" : "BOOKED", "duration" : this.hoursDifference, 
  "userId" : this.userDetails?.userId, 
  "startDateTime" : startDateTime.setHours(newStart.getHours(), newStart.getMinutes(), 0, 0),
  "endDateTime" : startDateTime.setHours(newEnd.getHours(), newEnd.getMinutes(), 0, 0),
  "startDate" : this.dateExample,
  "chargeId" : id, 
  "chargeIdStatus" : status,
  "totalAmount" : this.rentCharges,
  "bonusPayment" : id == 'bonus-payment' ? true : false};
  this._apiService.bookSpace(spaceData).subscribe(
    (response: any) => {
      loading.dismiss();
      if(response.code == '00') {
        this.showToast(response.message)
        if(id == 'bonus-payment') {
          this.userDetails.bonus = this.userDetails.bonus - this.totalFees;
          this.userService.setUserDetails(this.userDetails);
        }
        this.userDetails.bonus = 
      this.bookingButtonText = 'Successfully booked';   
      setTimeout(() => {
        let navigationExtras: NavigationExtras = {
          state: {
            navigationData: true
          }
        };
        this.router.navigateByUrl(`/tabs`, navigationExtras);
      }, 2000);
    }
    else {
      this.showToast(response.message)
    }
    },
    (error: any) => {
      loading.dismiss();
      console.error(error);
      this.showToast('Unable to book space');             
    }
  );
}


initPayPalButton(amount: any) {
  if (!this.isPayPalButtonRendered) {
    paypal.Buttons({
      createOrder: (_data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          this.showToast('Payment successful');
          this.bookSpace(details.id, 'paid');
        });
      },
      onError: (err: any) => {
        this.showToast(err);
        console.error('PayPal payment error:', err);
      }
    }).render('#paypal-button-container');
    
    this.isPayPalButtonRendered = true;
  }
}


async dismissModal() {
  await this.modalController.dismiss();
}
  

}
