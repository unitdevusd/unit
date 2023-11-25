import { Component, Input, OnInit, NgZone } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
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

  private url: any = 'https://gur.sandbox.imkloud.com';
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

  constructor(
    private api: ApiService,
    private _gs: GlobalService,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private zone : NgZone,
    private nativeGeocoder: NativeGeocoder,
    private geolocation : Geolocation
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
    if (this.navParams.get('filters')) {
      let filters = JSON.parse(this.navParams.get('filters'));
      console.log(filters);
      this.city = filters.city;
      if (filters.selectedDates) {
        this.dates.startDate = filters.selectedDates.startDate;
        this.dates.endDate = filters.selectedDates.endDate;
      }
      if (filters.features) {
        this.selectedFeaturs = filters.features;
      }
      if (filters.accessTime) {
        this.selectedTimeSlot = filters.accessTime;
      }
    }
    this.placeMeta();
  }
  placeMeta() {
    const params = {
      apiKey : 'rGpTKMEZjs3RR5vcfwg6pujoA54i33'
    };
    this.api.postRequest(this.url + '/api/v1/unit/placeMeta', params).subscribe(
      async (result) => {
        if (result.success) {
         console.log(result);
          this.features = result.data.list.amenities;
          console.log(this.features);
          if (this.selectedFeaturs.length) {
            this.selectedFeaturs.map((y: any) => {
              let index = this.features.indexOf(y._id);
              this.features.splice(index, 1);
            });
          }
          this.timeSlotTypeList = result.data.list.accessType;
          console.log(this.timeSlotTypeList);
          if (this.selectedTimeSlot.length) {
            this.selectedTimeSlot.map((x: any) => {
              this.selectedAccess = x;
            });
          };
        } else {
          console.log(result.message);
        }
      })
  }
  onTimeChange(ev: any) {
    this.selectedTimeSlot = [];
    this.selectedTimeSlot.push(ev.detail.value);
    console.log(this.selectedTimeSlot);
  }

  applyFilters() {
    let filters: any = {};
    if (this.selectedTimeSlot.length) {
      filters['accessTime'] = this.selectedTimeSlot;
    }
    if (this.dates.startDate && this.dates.endDate) {
      filters['selectedDates'] = this.dates;
    }
    if (this.city) {
      filters['city'] = this.city;
    }
    if (this.features.length) {
      let featuresArray = [];
      for (let i = 0; i < this.features.length; i++) {
        featuresArray.push(this.features[i]._id);
      }
      filters['features'] = featuresArray;
    }
    console.log(filters);
    // return;
    this.dismiss();
    this._gs.setFilterRefresh(filters);
  }


  clearFilters() {
    this.clearAll();
    this._gs.setFilterRefresh("");
  }
  clearAll() {
    this.selectedFeaturs = [];
    this.placeMeta();
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
    this.address = item.structured_formatting.main_text;
    this.autocomplete.input = this.address;
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

}
