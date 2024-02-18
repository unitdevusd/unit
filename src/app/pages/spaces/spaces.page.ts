import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder/ngx';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api-service.service';
import { fromEventPattern } from 'rxjs';

declare var google: any;


@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.page.html',
  styleUrls: ['./spaces.page.scss'],
})
export class SpacesPage implements OnInit {
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  public spaceForm!: FormGroup;
  userId: any;
  autocompleteItems: any[];
  lat: any;
  long: any;
  address: string;
  // autocomplete: { input: string; };
  GoogleAutocomplete: any;
  filters: any = {};
  userDetails: any;
  firstName: any;
  autocomplete: any;
  autocompletedInput: { input: string; };
  newRule: { input: string; };
  rules: string[] = [];
  totalSize: number = 0;
  largestFileSize: number = 0;
  



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
    private alertController: AlertController,
    private toastController: ToastController,






  ) {

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.newRule = { input: '' };

    this.userDetails = this.userService.getUserDetails();
    this.userId = this.userDetails?.userId;
    this.firstName = this.userDetails?.firstName || 'Guest';

    this.spaceForm = this.formBuilder.group({
      spaceLocation: new FormControl("", Validators.required),
      userId: this.userId,
      spaceType: new FormControl("", Validators.required),
      spaceImage: new FormControl([], Validators.required),
      spaceRules: new FormControl(this.rules),
      description: new FormControl("", Validators.required),
      chargePerDay: new FormControl("", Validators.required),
      size: new FormControl("", Validators.required),
      visitDays: new FormControl([], Validators.required),
      visitStartTime: new FormControl("", Validators.required),
      visitEndTime: new FormControl("", Validators.required),
      practice: ['yes'],
      musicDetails: new FormControl("", Validators.required),
      additionalDetails: new FormControl("", [
        Validators.required,
        Validators.pattern(/^(ftp|http|https):\/\/[^ "]+$/)
      ]),
    });
    
   }

  ngOnInit() {
  }



  async checkFormValidity() {

    const controlNames = {
      spaceLocation: 'Space Location',
      spaceType: 'Space Type',
      spaceImage: 'Space Image',
      spaceRules: 'Space Rules',
      description: 'Description',
      chargePerDay: 'Space Charge',
      size: 'Space Size',
      visitDays: 'Visit Days',
      visitStartTime: 'Visit Duration',
      visitEndTime: 'Visit Time',
      practice: 'Practice Option',
      musicDetails: 'Music Details',
      additionalDetails: 'Video URL',
    };

    const invalidControls: any = [];
    // Iterate through form controls and check their validity
    Object.keys(this.spaceForm.controls).forEach(key => {
      const control = this.spaceForm.get(key);
      if (control && control.invalid) {
        // Use custom name if available, otherwise use the key
        const controlName = (controlNames as any)[key] || key;
        invalidControls.push(controlName);
      }
    });
    // If there are invalid controls, display a notification
    if (invalidControls.length > 0) {
      const toast = await this.toastController.create({
        message: `Please fill in all required fields: ${invalidControls.join(', ')}`,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }





  onInputChange(event: any) {
    this.newRule.input = event.target.value;
  }

  addRule() {
    console.log('Adding rule');
    console.log('New rule:', this.newRule);
    if (this.newRule.input !== '') {
      this.rules.push(this.newRule.input);
      this.newRule.input = '';
      console.log(this.rules);
      const inputElement = document.getElementById('rules');
      if (inputElement) {
        (inputElement as HTMLInputElement).value = '';
      }
    }
    
  }

    removeRule(index: number) {
      this.rules.splice(index, 1);
    }


  searchLocation() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions: any, status: any) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction: any) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }


  selectSearchResult(item: any) {
    this.address = item.description;
    this.autocomplete.input = item.description;
    this.autocompleteItems = [];
  }


  async uploadSpace() {
    console.log(this.spaceForm.valid);
    this.checkFormValidity();

    if(this.spaceForm.valid) {

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
      this.showErrorAlert('Unexpected error occurred');
    }
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


  // onFileChange(event: any) {
  //   const file = event.target.files[0];

  //   if (file) {
  //     this.convertToBase64(file).then((base64) => {
  //       this.spaceForm.patchValue({
  //         spaceImage: base64,
  //       });
  //     });
  //   }
  // }

  // convertToBase64(file: File): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     const reader = new FileReader();

  //     reader.onloadend = () => {
  //       resolve(reader.result as string);
  //     };

  //     reader.onerror = (error) => {
  //       reject(error);
  //     };

  //     reader.readAsDataURL(file);
  //   });
  // }


  onFileChange(event: any) {
    const files: FileList = event.target.files;
  
    this.totalSize = 0;
    this.largestFileSize = 0;
  
    if (files && files.length > 0) {
  
      const promises: Promise<string>[] = [];
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.totalSize += file.size;
  
        if (file.size > this.largestFileSize) {
          this.largestFileSize = file.size;
        }
  
        if (file) {
          promises.push(this.convertToBase64(file));
        }
      }
  
      console.log(this.totalSize);
      console.log(this.largestFileSize);
  
      // Update message display based on total size and largest file size
      const maxTotalUploadMessage = document.getElementById('max-total-upload-message');
      const maxUploadPerFileMessage = document.getElementById('max-upload-per-file-message');
  
      if (maxTotalUploadMessage) {
        maxTotalUploadMessage.style.display = this.totalSize > 10 * 1024 * 1024 ? 'block' : 'none';
      }
  
      if (maxUploadPerFileMessage) {
        maxUploadPerFileMessage.style.display = this.largestFileSize > 2 * 1024 * 1024 ? 'block' : 'none';
      }
  
      Promise.all(promises)
        .then((base64Array) => {
          this.spaceForm.patchValue({
            spaceImage: base64Array,
          });
        })
        .catch((error) => {
          console.error('Error converting files to base64:', error);
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
