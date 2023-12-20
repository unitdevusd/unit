import { Component, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api-service.service';
import { fromEventPattern } from 'rxjs';


@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.page.html',
  styleUrls: ['./spaces.page.scss'],
})
export class SpacesPage implements OnInit {
  public spaceForm!: FormGroup;
  userId: any;
  autocompleteItems: any[];
  lat: any;
  long: any;
  address: string;
  autocomplete: { input: string; };
  GoogleAutocomplete: any;
  filters: any = {};
  userDetails: any;
  firstName: any;


  constructor(
    private formBuilder: FormBuilder,
    private userService : UserService,
    private camera: Camera,
    private geolocation : Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
    private loadingController: LoadingController,
    private router: Router,
    private apiService: ApiService,
    private alertController: AlertController





  ) {

    this.userDetails = this.userService.getUserDetails();
    this.userId = this.userDetails?.userId;
    this.firstName = this.userDetails?.firstName || 'Guest';



    this.spaceForm = this.formBuilder.group({
      spaceLocation: new FormControl("", Validators.required),
      userId: this.userId,
      spaceType: new FormControl("", Validators.required),
      spaceImage: new FormControl(""),
      description: new FormControl("", Validators.required),
      chargePerDay: new FormControl("", Validators.required),
      size: new FormControl("", Validators.required),
      visitDays: new FormControl("", Validators.required),
      visitStartTime: new FormControl("", Validators.required),
      visitEndTime: new FormControl("", Validators.required),
      practice: ['yes'],
      musicDetails: new FormControl("", Validators.required),
      additionalDetails: new FormControl("", Validators.required),
    });
    
   }

  ngOnInit() {
  }

  async uploadSpace() {
    console.log(this.spaceForm.valid);
    try {
      const loading = await this.loadingController.create();
      await loading.present();
  
      if (this.spaceForm.value) {
        const spaceData = this.spaceForm.value;
        console.log(spaceData);
        this.apiService.uploadSpace(spaceData).subscribe(
          (response: any) => {
            loading.dismiss();
            console.log('Response is '+response.code);
  
            if (response.code !== "00") {
              this.showErrorAlert(response.message); 
              this.router.navigateByUrl('/tabs', { replaceUrl: true });                
            } else {
              this.showSuccessAlert(response.message);
              setTimeout(() => {
                this.router.navigateByUrl('/tabs', { replaceUrl: true });             
              }, 2000);              
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


  async showSuccessAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
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

  get spaceTypeFormArray() {
    return this.spaceForm.get('spaceType') as FormArray;
  }


  openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      (imageData: any) => {
        // imageData is the file URI of the captured image
        this.spaceForm.patchValue({
          spaceImage: imageData
        });
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  useCurrentLocation(){
    if(this.lat && this.long){
      this.filters['location'] = [this.lat,this.long];
    }
  }


  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.convertToBase64(file).then((base64) => {
        this.spaceForm.patchValue({
          spaceImage: base64,
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
