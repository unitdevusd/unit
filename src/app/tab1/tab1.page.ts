import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IonicSlides, IonSearchbar, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { GlobalService } from 'src/app/services/global.service';
import { ToastService } from 'src/app/services/toast.service';
// import { config , KEY, UNITURL} from '../../config/config';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder/ngx';
import { FiltersPage } from '../filters/filters.page';
import { Platform } from '@ionic/angular';
import { LoaderService } from '../services/loader-service.service';
import { UserService } from '../services/user.service';
import { async } from 'rxjs';
import { Plugins } from '@capacitor/core';

const { Geocoder } = Plugins;


declare var google: any;


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  
  @ViewChild(IonicSlides) slides: any;
  @ViewChild('swiper') swiperRef: ElementRef;
  @ViewChild('searchbar', { static: false }) searchbar: IonSearchbar;
  
  spaceType: any[];
  spaces: any[];
  placesList: any = [];
  placesAround: any = [];
  placesFiltered: any = [];
  spacesList: any = [];
  units: any = [];
  today: any = Date.now();
  filters: any = {};
  spaceFilters: any = [];
  autocomplete: { input: string; };
  autocompleteItems: any[];
  GoogleAutocomplete: any;
  lat: any;
  long: any;
  address: string;
  hasFilter: boolean = false;
  displayName: boolean;
  size: number = 10;
  sizeFilter : number = 2; 
  token: any;
  orgId: any;
  isEnd : boolean = true;
  isfirst : boolean = false;
  user : string = 'User';
  clearFilter: boolean = false;
  firstName: string;
  role: string;
  userId: any;
  userDetails: any;


  constructor(
    private router: Router,
    private toastController: ToastController,
    private _apiService: ApiService,
    private _loader: LoaderService,
    private _gs: GlobalService,
    private storage : Storage,
    private _toast: ToastService,
    private geolocation : Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
    public modalCtrl : ModalController,
    private userService : UserService,
    private loadingController : LoadingController
    ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  ionViewWillEnter() {

    console.log('ionViewDidEnter is triggered');
    this.hasFilter = false;

    this.userDetails = this.userService.getUserDetails();
    this.firstName = this.userDetails?.firstName || 'Guest';
    this.role = this.userDetails?.role;
    this.userId = this.userDetails?.userId;
    this.getCurrentLocation();
    this.getMySpaces();
    this.getSpacesAround();

    console.log('Gotten spaces around');
  }

  getCurrentLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

    });
  }


  getAddressFromCoords(latitude: number, longitude: number) {
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


  useCurrentLocation(){
    if(this.lat && this.long){
      this.filters['location'] = [this.lat,this.long];
    }
  }




  ngOnInit() {
  }


  // searchLocation() {
  //   if (this.autocomplete.input == '') {
  //     this.autocompleteItems = [];
  //     return;
  //   }
  //   this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
  //     (predictions: any, status: any) => {
  //       this.autocompleteItems = [];
  //       this.zone.run(() => {
  //         predictions.forEach((prediction: any) => {
  //           this.autocompleteItems.push(prediction);
  //         });
  //       });
  //     });
  // }


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


  async selectSearchResult(item: any) {
    this.address = item.structured_formatting.main_text;
    this.autocomplete.input = this.address;
    this.autocompleteItems = [];
    const payload = { address: item.description };
    this._apiService.filterSpaces(payload).subscribe(
      (response: any) => {
        console.log('Response is '+response[0].spaceLocation);
        this.hasFilter = true;
        this.placesFiltered = response;
      },
      (error: any) => {
        console.error(error);
        this.showToast('Unable to fetch spaces');        
        // this.showErrorAlert('Unexpected error occurred');
      }
    );



  }



  getLatLOng(address: string): Promise<any> {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };
  
    return this.nativeGeocoder
      .forwardGeocode(address, options)
      .then((result: NativeGeocoderResult[]) => {
        const location = result[0];
        console.log('Location is '+location);
        return {
          latitude: location.latitude,
          longitude: location.longitude,
        };
      })
      .catch((error: any) => {
        console.error(error);
        throw error;
      });
  }


  // getLatLOng(addressString: any) : Promise<any> {
  //   console.log(addressString);
  //   let options: NativeGeocoderOptions = {
  //     useLocale: true,
  //     maxResults: 5,
  //   };
  //   console.log(options);
  //   return new Promise((resolve, reject) =>
  //   {
  //      this.nativeGeocoder.forwardGeocode(addressString)
  //      .then((result: NativeGeocoderResult[]) => 
  //      {
  //         console.log(result);
  //         resolve(result);
  //      })
  //      .catch((error: any) => 
  //      {
  //         reject(error);
  //      });
  //   });
  // }




  clearAutocomplete() {
    this.autocompleteItems = []
    this.autocomplete.input = '';
  }

  checkFocus() {}
  
  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FiltersPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        filters: JSON.stringify(this.filters)
      }
    });
    return await modal.present();
  }

  place(place: any) {
    console.log('Place is '+place.spaceLocation);
    let navigationExtras: NavigationExtras = {
      state: {
        place: place
      }
    };
    this.router.navigateByUrl(`/space-detail/${place.spaceId}`);
  }


  spaceClick(item: any) {
    console.log(item);
    this.filters['spaceType'] = item ? item : [];
    console.log(this.filters);
  }


  slidePrev() {
    this.slides.slidePrev().then((x: any) =>{
      console.log('x');
    })
  }
  slideNext() {
    this.slides.slideNext().then((X: any)=>{
      console.log('X');
    })  
  }


  clearFilters(){
    this.hasFilter= false;
    // this.zone.run(()=>{
    //    this.spaceType.map( x=> x.status = false);
    //    this.filters = {};
    // });
  }

  logout() {
    this.userService.clearUserDetails();
    this.router.navigate(['/login']);
  }

  addClicked() {
    this.router.navigate(['/spaces']);
  }

  optionClicked(optionNumber: number) {
    switch (optionNumber) {
      case 1:
        this.router.navigate(['/spaces']);
        break;
      case 2:
        this.showToast('Try to star new space!');
        break;
      default:
        break;
    }
 
  }

    async showToast(message: any) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000,
        position: 'bottom',
      });
      toast.present();
    }
  
    getAllSpaces() {
      const payload = { id: this.userId };
      this._apiService.viewAllSpacesByUser(payload);
    }



    async getMySpaces() {

      try {
        const loading = await this.loadingController.create();
        await loading.present();
    
        if (this.userId) {
          const spaceData = {"userId" : this.userId};
          this._apiService.viewAllSpacesByUser(spaceData).subscribe(
            (response: any) => {
              loading.dismiss();
              this.spaces = response
            },
            (error: any) => {
              console.error(error);
              loading.dismiss();
              this.showToast('Unable to fetch spaces');
              
              // this.showErrorAlert('Unexpected error occurred');
            }
          );
        }
      } catch (error) {
        console.error(error);
      }
  
  
    }


    async getAllCreatedSpaces(userId: any) {

      const loading = await this.loadingController.create();
      await loading.present();

      const userData = {"userId" : this.userDetails?.userId};
          this._apiService.retrieveSpaceImages(userData).subscribe(
            (response: any) => {
              loading.dismiss();
              if(response !== null) {
                this.spacesList = response;
              }             
            },
            (error: any) => {
              console.error(error);
              this.showToast('Unable to Fetch Spaces');             
            }
          );
  
    }


    async getSpacesAround() {

      try {
        const loading = await this.loadingController.create();
        await loading.present();
    
        if (this.userId) {
          const spaceData = {"latitude" : this.lat, "longitude" : this.long};
          this._apiService.getSpacesAround(spaceData).subscribe(
            (response: any) => {
              loading.dismiss();
              this.placesAround = response
            },
            (error: any) => {
              console.error(error);
              loading.dismiss();
              this.showToast('Unable to fetch spaces');             
              // this.showErrorAlert('Unexpected error occurred');
            }
          );
        }
      } catch (error) {
        console.error(error);
      }
  
  
    }

  
  
}

