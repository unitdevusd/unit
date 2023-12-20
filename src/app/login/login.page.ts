import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
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
    private userService: UserService
    ) {

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

  ngOnInit() { }

  // async login() {
  //   const loading = await this.loadingController.create();
  //   await loading.present();
  //   console.log(this.loginForm.value);
  //   if (this.loginForm.value) {
  //     let loginData = this.loginForm.value;
  //     console.log(loginData.email);
  //     this.authService.loginUser(loginData.email, loginData.password).then(async response => {
  //     await loading.dismiss();

  //       this.afs.collection('users').doc(response.user.uid).valueChanges().subscribe((userDetails: any) => {       
          
  //         if (userDetails) {
  //           const firstName = userDetails?.firstName;
  //           this.userService.setUserDetails(userDetails);
  //           console.log(firstName);
  //         }

  //       this.router.navigateByUrl('/tabs', { replaceUrl: true });
  //       this.showSuccessAlert(); 
  //       });
  //     }).catch(async error => {
  //       console.log(error);
  //       await loading.dismiss();
  //       this.showErrorAlert('Unexpected Error occurred. Try again later');
  //     });
  //   }
  // }
  registerpage() {
    this.router.navigateByUrl('/register-role', { replaceUrl: true });
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
            console.log('Response is '+response.email);
  
            if (!response.email) {
              this.showErrorAlert(response.message);    
            } else {
              this.userService.setUserDetails(response);
              this.showSuccessAlert();
                this.router.navigateByUrl('/tabs');               
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

