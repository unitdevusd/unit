import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../services/user.service';
import { FingerprintAIO, FingerprintOptions } from '@ionic-native/fingerprint-aio/ngx';
import { Device } from '@ionic-native/device/ngx';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { GoogleAuth, User } from '@codetrix-studio/capacitor-google-auth';
import { getAuth, GoogleAuthProvider, signInWithPopup, Auth, signInWithCredential } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
// import { auth, googleProvider } from '../firebase-config';

import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat';
import { Observable, from } from 'rxjs';




declare const gapi: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm!: FormGroup;
  message: string | null = null;
  available: boolean = false;
  deviceUUID: any = null;

  user: any;
  referral: string = '';

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
    private toastController: ToastController,
    private device: Device,
    private afAuth: AngularFireAuth,
    private googlePlus: GooglePlus

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

  

  async ngOnInit() {  
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

    await this.platform.ready();

    let deviceId = localStorage.getItem('deviceUUID');

    if (!deviceId || deviceId == null) {
      const result = await SecureStoragePlugin.get({ key: 'deviceUUID' });
      this.deviceUUID = result.value
    }
    else {
      this.deviceUUID = deviceId;
    }
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
          const payload = { deviceId: this.deviceUUID };
          if(this.deviceUUID == null || this.deviceUUID == undefined) {
            loading.dismiss();
            this.showToast('Please login to enable biometric verification');
            return;
          }

          else {

          try {
            this.authService.validateFingerPrint(payload).subscribe(
              (response: any) => {
                loading.dismiss();    
                if (response.email) {
                  this.showToast('Authentication successful');
                  this.userService.setUserDetails(response);
                  let navigationExtras: NavigationExtras = {
                    state: {
                      navigationData: true
                    }
                  };
                  this.router.navigateByUrl(`/tabs`, navigationExtras);
                } else {
                  this.showErrorAlert('Please login to enable biometric verification')
                }
                  },
              (error: any) => {
                loading.dismiss();
                console.error(error);
                this.showToast('Unable to login');
              }
            );

          } catch (error) {
            loading.dismiss();
            console.error('Error ', error);
            alert(error);
          }
        }
        } else {
          ('Invalid Fingerprint');
        }
      } catch (error) {
        console.log({ error });
      }
    } else {
      console.log('Biometric authentication is not supported in this environment.');
    }  
  
  }

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


 
  private async initializeGoogleAuth() {
    try {
      const clientId = this.getGoogleClientIdBasedOnPlatform();
  
      await GoogleAuth.initialize({
        clientId,
        grantOfflineAccess: false,
      });
  
      console.log('Google Auth initialized successfully');
    } catch (error) {
      console.error('Google Auth initialization failed', error);
    }
  }

  private getGoogleClientIdBasedOnPlatform(): string {
    if (this.platform.is('android') || this.platform.is('ios')) {
      return '702532803931-9cupbdo5pnhb3dhklk3ffvd6pslbgs8s.apps.googleusercontent.com';
    } else {
      return '702532803931-a9h653uno2r0srbm22c83olkglllooft.apps.googleusercontent.com';
    }
  }



  // async googleLogin2(): Promise<void> {
  //   try {
  //     let userCredential;

  //     if (this.platform.is('android') || this.platform.is('ios')) {
  //       const googleUser: User = await GoogleAuth.signIn();
  //       const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
  //       userCredential = await signInWithCredential(auth, credential);
  //     } else if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
  //       userCredential = await signInWithPopup(auth, googleProvider);
  //     }

  //     if (userCredential?.user) {
  //       console.log('Signed in user UID:', userCredential.user.uid);
  //       console.log('Signed in user display name:', userCredential.user.displayName);
  //       console.log('Signed in user email:', userCredential.user.email);
  //       console.log('Signed in user photo URL:', userCredential.user.photoURL);
  //       console.log('Is email verified:', userCredential.user.emailVerified);
  //     }

  //   } catch (error) {
  //     console.error('Google sign-in failed:', error);
  //   }
  // }


  googleLogin() {
    if (this.platform.is('mobile')) {
      if (this.platform.is('capacitor')) {
        this.nativeGoogleLogin();
      } 
    } else {
      this.webGoogleLogin();
    }
  }

  async nativeGoogleLogin() {
    await GoogleAuth.initialize({
      clientId: '702532803931-a9h653uno2r0srbm22c83olkglllooft.apps.googleusercontent.com',
      grantOfflineAccess: true, 
    });
    
    try {
      await GoogleAuth.signOut();
      const user = await GoogleAuth.signIn();
      console.log('User info:', user);
      this.user = user;
      if (this.user.email) {
        this.socialLogin(this.user);
      }
    } catch (err) {
      console.error('Google login error:', err);
    }
  }

  nativeGoogleLoginForCapacitor() {
    this.googlePlus.login({
      'webClientId': '702532803931-a9h653uno2r0srbm22c83olkglllooft.apps.googleusercontent.com',
      'offline': true,
      'scopes': 'profile email'
    }).then((res: any) => {
      console.log('Google login success:', res);
      this.user = res;
      if (this.user.email) {
        this.socialLogin(this.user);
      }
    }).catch((err: any) => {
      console.error('Google login error:', err);
    });  }

  webGoogleLogin() {
    const provider = new GoogleAuthProvider();
    this.afAuth.signInWithPopup(provider).then((result) => {
      this.user = result.user;
      console.log('User signed in:', this.user);
      if (this.user.email) {
        this.socialLogin(this.user);
      }
    }).catch((error) => {
      console.error('Sign in error:', error);
    });
  }

  // googleLogin() {
  //   this.googleSignin().subscribe({
  //     next: (response) => {
  //       this.user = response.user;
  //       if(this.user.email && this.user.email != null) {
  //         this.socialLogin(this.user)
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Sign in error:', error);
  //     }
  //   });
  // }
 

  googleSignin(): Observable<any> {
    const provider = new GoogleAuthProvider();
    return from(this.afAuth.signInWithPopup(provider));
  }

  getCurrentUser(): Observable<any> {
    return this.afAuth.authState;
  }




  async socialLogin(user: any) {
    try {
      const loading = await this.loadingController.create();
      await loading.present();
  
        const loginData = {"email" : user.email, "displayName" : user.displayName, "referral" : this.referral}
        this.authService.socialLoginAuthentication(loginData).subscribe(
          (response: any) => {
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
              this.showToast(response.message);
            }
          },
          (error: any) => {
            console.error(error);
            loading.dismiss();
            this.showToast('Unexpected error occurred');
          }
        );
    } catch (error) {
      console.error(error);
    }
  }





  
  
}

