import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

    const userDetails = this.userService.getUserDetails();
    this.userId = userDetails?.userId;


    this.spaceForm = this.formBuilder.group({
      spaceLocation: ["", Validators.required],
      userId: this.userId,
      spaceType: new FormControl("", Validators.required),
      spaceImage: new FormControl(""),
      description: new FormControl("", Validators.required),
      chargePerDay: new FormControl("", Validators.required),
    });
    setTimeout(() =>{ 
      this.getCurrentLocation();
    }, 1500);

    this.autocomplete = { input: '' };

    
   }

   getCurrentLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('Response from getCurrentLocation is '+resp.coords.latitude+ " and "+resp.coords.longitude);
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
    });
  }

  getAddressFromCoords(latitude: number, longitude: number) {
    console.log("getAddressFromCoords " + latitude + " " + longitude);
    if (latitude == undefined) {
      return;
    }
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });
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
    this.address = item.structured_formatting.main_text;
    this.autocomplete.input = this.address;
    this.autocompleteItems = [];
    this.getLatLOng(item.description).then(location =>{
      this.filters['location'] = [location[0]['longitude'],location[0]['latitude']];
      console.log(this.filters);
      // this.getPlacesList(this.filters);
    });
  }



  getLatLOng(addressString: any) : Promise<any> {
    console.log(addressString);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };
    console.log(options);
    return new Promise((resolve, reject) =>
    {
       this.nativeGeocoder.forwardGeocode(addressString)
       .then((result: NativeGeocoderResult[]) => 
       {
          console.log(result);
          resolve(result);
       })
       .catch((error: any) => 
       {
          reject(error);
       });
    });
  }


  clearAutocomplete() {
    this.autocompleteItems = []
    this.autocomplete.input = '';
  }

  checkFocus() {}

  ngOnInit() {
    console.log('here in the spaces');
  }

  async uploadSpace() {
    try {
      const loading = await this.loadingController.create();
      await loading.present();
  
      if (this.spaceForm.value) {
        const spaceData = this.spaceForm.value;
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
