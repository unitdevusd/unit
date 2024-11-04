import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../services/user.service';
import { FingerprintAIO, FingerprintOptions } from '@ionic-native/fingerprint-aio/ngx';
import { Device } from '@ionic-native/device/ngx';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm!: FormGroup;
  message: string | null = null;
  available: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    // private afs: AngularFirestore,
    private userService: UserService,
    private navCtrl: NavController,
    private fingerprintAIO: FingerprintAIO,
    private platform: Platform,
    private device: Device,
    private toastController: ToastController


    ) {

      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras.state) {
        this.message = navigation.extras.state['message'];
      }
  
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

    this.checkAvailability();

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
              this.showToast(response.message);
            }
          },
          (error: any) => {
            console.error(error);
            loading.dismiss();
            this.showToast('Unexpected error occurred');
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  async handleFingerprintScan() {
    // Your logic for handling the fingerprint scan
    if (this.platform.is('cordova')) {
      try {
        const options: FingerprintOptions = {
          title: 'Scan your fingerprint',
          description: 'Please authenticate',
          disableBackup: true,
        };

        const result = await this.fingerprintAIO.show(options);
        console.log(result);

        if (result === 'biometric_success') {
          const loading = await this.loadingController.create();

          await loading.present();

          const id = this.device.uuid;
          const payload = { deviceId: id };

          try {
            const response: any = this.authService.validateFingerPrint(payload);
            loading.dismiss();
            if (response.email) {
              this.userService.setUserDetails(response);
              let navigationExtras: NavigationExtras = {
                state: {
                  navigationData: true
                }
              };
              this.router.navigateByUrl(`/tabs`, navigationExtras);
            } else {
              this.showErrorAlert(response.message);
            }
          } catch (error) {
            loading.dismiss();
            console.error('Error ', error);
            alert(error);
          }
        } else {
          ('Invalid Fingerprint');
        }
      } catch (error) {
        console.log({ error });
      }
    } else {
      console.log('Biometric authentication is not supported in this environment.');
    }  }

  async checkAvailability(): Promise<boolean> {
    try {
      const result = await this.fingerprintAIO.isAvailable();
      this.available = true
      return true;
    } catch (error) {
      console.error('Fingerprint availability check failed', error);
      this.available = false;
      return false;
    }
  }

  async showToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}

