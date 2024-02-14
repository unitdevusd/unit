import { Component, Input, OnInit, NgZone, Output, EventEmitter } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { GlobalService } from 'src/app/services/global.service';
// import { config, KEY, UNITURL } from '../../config/config';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder/ngx';

declare var google: any;

@Component({
  selector: 'app-filters',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],
  providers: [NavParams]
})
export class FiltersPage implements OnInit {
  
  @Input() filters: any;

  // private url: any = 'https://gur.sandbox.imkloud.com';
  features: any = [];
  timeSlotTypeList: any = [];
  public dates = {
    startDate: '',
    endDate: ''
  }
  selectedFeaturs: any = [];
  selectedTimeSlot: any = [];
  selectedAccess: any;
  city: any = '';
  autocomplete: { input: string; };
  autocompleteItems: any[];
  GoogleAutocomplete: any;
  lat: any;
  long: any;
  address: any;
  startPrice: number = 20;
  endPrice: number = 80;
  priceRange: { lower: number, upper: number } = { lower: this.startPrice, upper: this.endPrice };
  spaceFloor: string;
  searchResults: string;
  constructor(
    private api: ApiService,
    private _gs: GlobalService,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private zone : NgZone,
    private nativeGeocoder: NativeGeocoder,
    private geolocation : Geolocation,
    private _apiService : ApiService,
    private loadingController : LoadingController,
  ) { 

     // get current location
     setTimeout(() =>{ 
      this.getCurrentLocation();
    }, 1500);
    
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];

  }
 

  ngOnInit() {
  }


  updatePriceRange(event: CustomEvent) {
    this.priceRange = event.detail.value;
    console.log('Selected Price Range:', this.priceRange);
    // You can perform additional logic here if needed
  }

  onTimeChange(ev: any) {
    this.selectedTimeSlot = [];
    this.selectedTimeSlot.push(ev.detail.value);
    console.log(this.selectedTimeSlot);
  }

  applyFilters() {
    this.getSpacesFromFilters();
    // this.dismiss();
  }


  clearFilters() {
    this.clearAll();
    this._gs.setFilterRefresh("");
  }
  clearAll() {
    this.selectedFeaturs = [];
    this.dates.startDate = '';
    this.dates.endDate = '';
    this.city = '';
    this.selectedAccess = '';
    this.dismiss();
  }
  clearFeature(i: any) {
    this.features.splice(i);
  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  dismissWithData(responseData: any) {
    this.modalCtrl.dismiss({
      role: 'applied',
      data: responseData
    });
  }

  checkFocus(){
    console.log('focus');
  }

  clearAutocomplete(){
    this.autocompleteItems = []
    this.autocomplete.input = '';
  }

  searchLocation(){
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
    this.getLatLOng(item.description).then(location =>{
      this.filters['location'] = [location[0]['longitude'],location[0]['latitude']];
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

  getCurrentLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
    });
  }

  useCurrentLocation(){
    if(this.lat && this.long){
      this.filters['location'] = [this.lat,this.long];
    }
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

  async getSpacesFromFilters() {

    const payload = { spaceLocation: this.autocomplete.input, spaceType : this.spaceFloor, 
      lowerPriceRange : this.priceRange.lower, upperPriceRange : this.priceRange.upper };
    const loading = await this.loadingController.create();
    await loading.present();
    this._apiService.filterPreference(payload).subscribe(
      (response: any) => {
        if (response.length > 0) {
        console.log('Response is '+response[0].spaceLocation);
        loading.dismiss();

       
        this.dismissWithData(response);
        }
        else {
          loading.dismiss();
          this.searchResults = 'No Location matches your filter';
          console.log('No Location found');
        }
      },
      (error: any) => {
        console.error(error);
        loading.dismiss();    
      }
    );
    
  }

}
