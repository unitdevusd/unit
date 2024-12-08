import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-rate-space-modal',
  templateUrl: './rate-space-modal.component.html',
  styleUrls: ['./rate-space-modal.component.scss'],
})

export class RateSpaceModalComponent {
  rating: number; 
  comments: string = '';
  @Input() bookingId: string;

  constructor(private modalController: ModalController,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private toastController: ToastController) {}

  dismiss() {
    this.modalController.dismiss(this.rating);
  }

  async submitRating() {
    
    if (this.rating && this.comments) {
      const loading = await this.loadingController.create();
      await loading.present();
      const payload = {"comment" : this.comments, "rating" : this.rating, "bookingId" : this.bookingId};
      this.apiService.rateSpace(payload).subscribe(
        (response: any) => {
          if(response != null) {
            this.showToast(response.message)
          loading.dismiss();  
        }
        else {
          loading.dismiss(); 
          this.showToast('Unable to rate space');             
        }                
        },
        (error: any) => {
          console.error(error);
          loading.dismiss();
          this.showToast('Unable to rate space');             
        }
      );
      this.dismiss();
    } else {
      alert('Please provide both rating and comments');
    }
  }

  onRatingChange(newRating: number) {
    this.rating = newRating;
    console.log('New Rating:', this.rating);
  }

  async showToast(message: any) {
      const toast = await this.toastController.create({
        message: message,
        duration: 4000,
        position: 'bottom',
        cssClass: 'centered-toast',
      });
      toast.present();
  }
}
