import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    // private afs: AngularFirestore,
    private userService: UserService,
    private navCtrl: NavController
    ) {

  
  }


  ionViewWillEnter() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new FormControl("", Validators.required),
    });


  }

  

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new FormControl("", Validators.required),
    });

   }

  registerpage() {
    // this.router.navigateByUrl('/register-role', { replaceUrl: true });
    this.router.navigateByUrl('/register-role');
  }

  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Login successful!',
      buttons: ['OK']
    });

    await alert.present();
  }

  async showErrorAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();

  }


  async loginUser() {
    try {
      const loading = await this.loadingController.create();
      await loading.present();
  
      if (this.loginForm.value) {
        const loginData = this.loginForm.value;
        await this.authService.authenticateUser(loginData).subscribe(
          (response: any) => {
            loading.dismiss();
            // console.log('Response is '+response.email);
  
            if (response.email) {
              this.userService.setUserDetails(response);
              // this.showSuccessAlert();

              let navigationExtras: NavigationExtras = {
                state: {
                  navigationData: true
                }
              };
              this.router.navigateByUrl(`/tabs`, navigationExtras);
          
              // this.router.navigateByUrl('/tabs');   

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
      }
    } catch (error) {
      console.error(error);
    }
  }
}

