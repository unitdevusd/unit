import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api-service.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

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


  constructor(
    private userService : UserService,
    private apiService : ApiService,
    private toastController: ToastController,
    private alertController : AlertController,
    private router: Router,

  ) {}

  ionViewWillEnter() {
    this.userDetails = this.userService.getUserDetails();
    this.firstName = this.userDetails?.firstName || 'Guest';
    this.role = this.userDetails?.role;
    this.userId = this.userDetails?.userId;
    console.log('First Name is ' + this.firstName + ' and role is ' + this.role);
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  toggleRole(realRole: any) {
    this.role = realRole;
    console.log('Before toggle role is '+this.role);
    this.role = this.role === 'HOST' ? 'TENANT' : 'HOST';
    console.log('New role is '+this.role);
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



  async updateRole() {

    const userData = {"userId" : this.userId, "role" : this.role};
        this.apiService.updateUserRole(userData).subscribe(
          (response: any) => {

            if(response !== null) {
              this.userService.setUserDetails(response);
              this.showToast('You are now a '+this.role);
              this.router.navigateByUrl('/tabs');               
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
}
