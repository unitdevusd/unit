import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


public signupForm!: FormGroup;
  role: string | null;


  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute, 
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { 
    const roleParam = this.route.snapshot.paramMap.get('role');
    if(roleParam !== null) {
      console.log('Role is '+roleParam);
      this.role = roleParam.toUpperCase();
    }
    this.signupForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      role: new FormControl(this.role, Validators.nullValidator),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ]),
      ),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });

  }

  ngOnInit() {
  }

  async registerUser() {
    const loading = await this.loadingController.create();
    await loading.present();
    console.log(this.signupForm.value);
    if (this.signupForm.value) {
      let registerData = this.signupForm.value;
        this.authService.register(registerData.email,registerData.password).then(async response =>{
          await loading.dismiss();
          console.log(response);
          if(response.user == undefined) {
            this.showFailureAlert('User already exists');
          }
          else {
            this.showSuccessAlert();
            const user = response.user;
            console.log('User is ' +user);
            const uid = user.uid;
            console.log('UID is '+uid);
            this.custom(user,uid,registerData);
            setTimeout(() => {
              this.router.navigateByUrl('/login', { replaceUrl: true });
            }, 2000);
          }

        }).catch(async error => {
          await loading.dismiss();
       });
    }

  }
  custom(user : any , uid : any,userInfo : any) {
    let data = {
      role: this.role,
      firstName :userInfo.firstName,
      lastName : userInfo.lastName
    };
    console.log('Data is '+data);
    this.authService.saveAdditionalUserData(uid,data);
    
  }


  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'User successfully created. Please login.',
      buttons: ['OK']
    });
  
    await alert.present();
  }

  async showFailureAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Failure',
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
  }


  async createUser() {
    try {
      const loading = await this.loadingController.create();
      await loading.present();
  
      if (this.signupForm.value) {
        const registerData = this.signupForm.value;
        this.authService.createUser(registerData).subscribe(
          (response) => {
            loading.dismiss();
            console.log('Response is '+response.code);
  
            if (response && response.code !== '00') {
              this.showFailureAlert(response.message);
            } else {
              this.showSuccessAlert();
              setTimeout(() => {
                this.router.navigateByUrl('/login', { replaceUrl: true });
              }, 2000);
            }
          },
          (error) => {
            console.error(error);
            loading.dismiss();
            this.showFailureAlert('Unexpected error occurred');
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
