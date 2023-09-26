import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user!: any;
email: any;
password: any;


  constructor(
    public authService: AuthService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {}

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.authService.loginUser(this.email, this.password).then(async resposne => {
      await loading.dismiss();
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    }).catch(async error => {
       await loading.dismiss();
    })
  }
  registerpage(){
    this.router.navigateByUrl('/register', { replaceUrl: true });
  }
}



  // constructor(
  //   public fireAuth: AuthService
  // ) {}

  // ngOnInit() {
  // }


 
  // login(){
  //   this.fireAuth.loginUser('test@yopmail.com', 'Test@12345').then(resposne =>{
  //     console.log('Res-->',resposne);
  //   }).catch(error =>{
  //     console.log(error);
  //   })
  // }

// }
