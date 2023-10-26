import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

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
    private loadingController: LoadingController
  ) {

    this.loginForm = this.formBuilder.group({
      emailId: new FormControl(
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

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    console.log(this.loginForm.value);
    if (this.loginForm.value) {
      let loginData = this.loginForm.value;
      this.authService.loginUser(loginData.email, loginData.password).then(async resposne => {
        await loading.dismiss();
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      }).catch(async error => {
        console.log(error);
        await loading.dismiss();
      });
    }
  }
  registerpage() {
    this.router.navigateByUrl('/register-role', { replaceUrl: true });
  }
}

