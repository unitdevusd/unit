import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email: any;
  password: any;

  constructor(
    public authService: AuthService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  async registerUser() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.authService.register(this.email,this.password).then(async response =>{
      await loading.dismiss();
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    }).catch(async error => {
      await loading.dismiss();
   });
  }

}
