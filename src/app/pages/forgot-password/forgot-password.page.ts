import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  otpArray: string[] = new Array(4).fill('');
  @Output() otpEntered = new EventEmitter<string>();
  passwordMismatch: boolean = false;

  public loginForm!: FormGroup;
  public resetPasswordForm!: FormGroup;
  public validEmail: boolean = false;
  public resetPass: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController,
    private toastController: ToastController

  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
    });


    this.resetPasswordForm = this.formBuilder.group({
      password: new FormControl("", Validators.required),
      confirmPassword: new FormControl("", Validators.required),
    });

   }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.validEmail = false;
    this.resetPass = false;
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
    });


    this.resetPasswordForm = this.formBuilder.group({
      password: new FormControl("", Validators.required),
      confirmPassword: new FormControl("", Validators.required),
    });

  }

  registerpage() {
    this.router.navigateByUrl('/login');

  }

  onConfirmPasswordInput() {
    const password = this.resetPasswordForm.get('password')?.value;
    const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;
    if (confirmPassword !== password) {
      this.passwordMismatch = true;
    } else {
      this.passwordMismatch = false;
    }
  }

  async resetPassword() {
    try {
      const loading = await this.loadingController.create();
      await loading.present();
  
      if (this.resetPasswordForm.value) {
        const passData = {"password" : this.resetPasswordForm.get('password')?.value, "email": this.loginForm.get('email')?.value};
        await this.authService.resetUserPassword(passData).subscribe(
          (response: any) => {
            loading.dismiss();
  
            if (response.code != '00') {
          
              this.showErrorAlert(response.message);    
            } else {
              this.validEmail = true;
              this.showToast(response.message);
              // this.showSuccessAlert(response.message);
              this.router.navigateByUrl('/login');

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

  async validateEmail() {
    try {
      const loading = await this.loadingController.create();
      await loading.present();
  
      if (this.loginForm.value) {
        const loginData = this.loginForm.value;
        await this.authService.validateEmail(loginData).subscribe(
          (response: any) => {
            loading.dismiss();
  

            if (response.code != '00') {
              this.showErrorAlert(response.message);    
            } else {
              this.validEmail = true;
              this.showToast(response.message)
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


  async showErrorAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();

  }

  async showSuccessAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }




  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    
    const val = input.value;

    if (isNaN(Number(val))) {
      input.value = '';
      return;
    }

    // Update the specific index with the input value
    this.otpArray[index] = val;

    // Move focus to the next input if there is a value
    if (val !== '' && index < this.otpArray.length - 1) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }

    if (index === this.otpArray.length - 1 && val !== '') {
      this.emitOtpEntered();
    }  }

  onKeyup(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    const key = event.key.toLowerCase();

    if (key === 'backspace' || key === 'delete') {
      input.value = '';
      if (index > 0) {
        const prevInput = input.previousElementSibling as HTMLInputElement;
        if (prevInput) 
          prevInput.focus();
        }
      }
    }


    onPaste(event: ClipboardEvent, index: number) {
      event.preventDefault(); // Prevent default paste behavior
      const clipboardData = event.clipboardData || (window as any).clipboardData;
      const pastedText = clipboardData.getData('text');
  
      // Loop through pasted text and update OTP array
      for (let i = 0; i < pastedText.length && index + i < this.otpArray.length; i++) {
        const char = pastedText[i];
        if (!isNaN(Number(char))) {
          this.otpArray[index + i] = char;
        }
      }
  
      // Update input values
      const target = event.target as HTMLElement;
      const parent = target.parentElement;
      if (parent) {
        const inputs = parent.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
        inputs.forEach((input, i) => input.value = this.otpArray[i]);
      }
  
      // Move focus to the next input if there is a value
      const nextIndex = index + pastedText.length;
      if (nextIndex < this.otpArray.length) {
        const nextInput = parent?.querySelectorAll('input')[nextIndex] as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
  
      // Log only when input is added to the last box
      if (index + pastedText.length - 1 === this.otpArray.length - 1) {
        this.emitOtpEntered();
      }
    
    }

    emitOtpEntered() {
      const otpValue = this.otpArray.join(''); 
      this.otpEntered.emit(otpValue);
      this.validateOtp(otpValue);
    }


    async validateOtp(otp: any) {
      try {
        const loading = await this.loadingController.create();
        await loading.present();
    
          const otpData = {"otp" : otp, "email" : this.loginForm.get('email')?.value};
          this.authService.validateOtp(otpData).subscribe(
            (response: any) => {
              loading.dismiss();

    
              if (response.code != '00') {
                this.showErrorAlert(response.message);    
              } else {
                this.validEmail = false;
                this.resetPass = true;
                this.showToast(response.message)  
              }
            },
            (error: any) => {
              console.error(error);
              loading.dismiss();
              this.showToast('Unexpected error occurred')
            }
          );
      } catch (error) {
        console.error(error);
      }
  
    }

    async resendOtp() {

      this.validateEmail();
  
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

