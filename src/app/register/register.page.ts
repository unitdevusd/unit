import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

public signupForm!: FormGroup;
  role: string | null;
  profilePictureUrl: any;
  selectedFile: File;


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
      profilePicture: new FormControl(''),
      referralCode: new FormControl('', Validators.required),
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
            this.showFailureAlert('Unexpected error occurred. Use a lower image size');
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  }


  // onFileSelected(event: any) {
  //   // Handle the selected file(s) here
  //   const selectedFile = event.target.files[0];

  //   // Example: Read the file contents and set the profilePictureUrl
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.profilePictureUrl = reader.result as string;
  //   };
  //   reader.readAsDataURL(selectedFile);
  // }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.profilePictureUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    // if(file) {
    //   this.signupForm.patchValue({
    //     profilePicture: file
    //   });
    // }
   


    if (file) {
      this.convertToBase64(file).then((base64) => {
        this.signupForm.patchValue({
          profilePicture: file,
        });
      });
    }
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

}
