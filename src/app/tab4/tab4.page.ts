import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api-service.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  withdrawalItems:any = [];
  pageNumber: number = 0;
  userDetails: any;
  role: any;

  constructor(
    private apiService: ApiService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private userService: UserService,
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.userDetails = this.userService.getUserDetails();
    this.role = this.userDetails?.role;
    this.fetchWithdrawalRequests();
  }


  async fetchWithdrawalRequests() {
        const loading = await this.loadingController.create();
        await loading.present();
        const userData = {"pageNumber" : this.pageNumber, "pageSize" : 20};
        this.apiService.getWithdrawalRequests(userData).subscribe(
          (response: any) => {
            loading.dismiss();
            // if(response.empty != false) {
            //   // this.withdrawalItems = [...this.withdrawalItems, ...response.content];
            //   this.withdrawalItems = response.content;
            //   console.log(this.withdrawalItems.length)
            // }   
            
            if (response.content.length > 0) {
              this.withdrawalItems = response.content;
              console.log(this.withdrawalItems.length);
            }
          },
          (error: any) => {
            console.error(error);
            loading.dismiss();
            this.showToast('Unable to Fetch requests');             
          }
        );
          this.pageNumber++;
  }

  async showToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  async approve(item: any, status: string) {
    const loading = await this.loadingController.create();
    await loading.present();
    const userData = {"withdrawalRequestId" : item.withdrawalRequestId, "completed": status};
    this.apiService.approveRequests(userData).subscribe(
      (response: any) => {
        loading.dismiss();
        const index = this.withdrawalItems.findIndex((i: { withdrawalRequestId: any; }) => i.withdrawalRequestId === item.withdrawalRequestId);
        if (index > -1) {
          this.withdrawalItems.splice(index, 1);
        }
        this.fetchWithdrawalRequests();
        this.showToast(response.message);     
      },
      (error: any) => {
        console.error(error);
        loading.dismiss();
        this.showToast('Unable to approve request');             
      }
    );
  }
}
