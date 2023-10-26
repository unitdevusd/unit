import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
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
    private loadingController: LoadingController
  ) { 
    this.role = this.route.snapshot.paramMap.get('role');
    this.signupForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phoneno: new FormControl('', Validators.nullValidator),
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
          const user = response.user;
          const uid = user.uid;
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
          this.custom(user,uid,registerData);
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
    this.authService.saveAdditionalUserData(user,data);
    
  }

}
