import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IonContent, IonicSlides, IonInfiniteScroll, IonSearchbar, LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
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
import { HttpClient } from '@angular/common/http';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

const { Geocoder } = Plugins;


declare var google: any;


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('svgContainer', { static: false }) svgContainer: ElementRef;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  @ViewChild(IonicSlides) slides: any;
  @ViewChild('swiper') swiperRef: ElementRef;
  @ViewChild('searchbar', { static: false }) searchbar: IonSearchbar;

  @Input() balance: number = 0;
  @Input() withdrawnBalance: number = 0;

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
  searchResults: any;
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
  lastName: string;
  role: string;
  userId: any;
  userDetails: any;
  showBalance: boolean = true;
  svgText: string;
  current_page = 0;
  page_size = 5;
  search_page = 0;
  isLoading = false;
  totalPages = 1;
  floorTypeUrl: string;
  isSpinning = false;
  bonus = 0;
  searchKeyword: string;



  constructor(
    private router: Router,
    private toastController: ToastController,
    private _apiService: ApiService,
    private _gs: GlobalService,
    private geolocation : Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
    public modalCtrl : ModalController,
    private userService : UserService,
    private loadingController : LoadingController,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,

    ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];


    this.hasFilter = false;

    this.userDetails = this.userService.getUserDetails();
    this.firstName = this.userDetails?.firstName || 'Guest';
    this.lastName = this.userDetails?.lastName || 'Guest';
    this.role = this.userDetails?.role;
    this.userId = this.userDetails?.userId;
    this.bonus = this.userDetails?.bonus;

    this.getCurrentLocation();

    if(this.role === 'HOST') {
      this.getMySpaces();
      this.getAccountBalance();
    }

    if(this.role === 'TENANT' || this.role === 'ADMIN') {
      // this.getSpacesAround();
      this.getSpacesAround(0, this.page_size);
    }

  }

  ionViewDidEnter() {
    this.resetData();
    // const content = document.querySelector('ion-content');
    // if (content) {
    //     this.current_page = 0;
    //     content.scrollToTop(0);
    //     this.placesAround = [];
    // }

  }



  ionViewWillEnter() {
    this.resetData();
  let url = "";
    this.hasFilter = false;
    this.userDetails = this.userService.getUserDetails();
    this.firstName = this.userDetails?.firstName || 'Guest';
    this.userId = this.userDetails?.userId;
    this.role = this.userDetails?.role;
    this.bonus = this.userDetails?.bonus;
    this.getCurrentLocation();
    if(this.role === 'HOST') {
      url = 'assets/imgs/Host-Tag.svg';
      this.getMySpaces();
      this.getAccountBalance();
    }
    if(this.role === 'TENANT' || this.role === 'ADMIN') {
      url = 'assets/imgs/Dancer-Tag.svg';
      this.getSpacesAround(this.current_page, this.page_size);
    }
    this.fetchSvgFile(url);
  }

  ngAfterViewInit() {
    var url;
    if(this.role == 'HOST') {
      url = 'assets/imgs/Host-Tag.svg';
    }
    else {
      url = 'assets/imgs/Dancer-Tag.svg';
    }
    this.fetchSvgFile(url);

  }


  // ngAfterViewInit() {
  //   this.resetData();
  //   var url;
  //   if(this.role == 'HOST') {
  //     url = 'assets/imgs/Host-Tag.svg';
  //   }
  //   else {
  //     url = 'assets/imgs/Dancer-Tag.svg';
  //   }
  //   this.fetchSvgFile(url);

  // }

  resetData() {
    this.current_page = 0;
    this.search_page = 0;
    this.placesAround = [];
    if(this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }
  }

  fetchSvgFile(svgPath: string) {
    this.http.get(svgPath, { responseType: 'text' })
      .subscribe(
        (svgData: string) => {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgData, 'image/svg+xml');
          this.renderSvg(svgDoc);
        },
        (error) => {
          console.error('Error loading SVG file:', error);
        }
      );
  }


  renderSvg(svgDoc: Document) {
    const svgElement = svgDoc.querySelector('svg');
    if (svgElement) {
      const svgContainer = this.svgContainer.nativeElement;
      svgContainer.innerHTML = ''; // Clear any previous content
      svgContainer.appendChild(svgElement);

    }
  }

  toggleBalanceVisibility() {
    this.showBalance = !this.showBalance;
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

  getExactLocation(item: any): Promise<string> {
    const apiKey = 'AIzaSyCZme7cYLG7jnK4Cn8ZFnQJDUKPNwIsfqI';
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.lat},${this.long}&key=${apiKey}`;

    return fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {

          this.autocomplete.input = data.results[0].formatted_address;
          return data.results[0].formatted_address;
        } else {
          return Promise.reject('No address found');
        }
      });
  }


  async selectSearchResult(item: any) {
    this.address = item.structured_formatting.main_text;
    this.autocomplete.input = item.description;
    this.autocompleteItems = [];
    const payload = { address: item.description };
    const loading = await this.loadingController.create();
    await loading.present();
    this._apiService.filterCloseSpaces(payload).subscribe(
      (response: any) => {
        if (response.length > 0) {
        console.log('Response is '+response[0].spaceLocation);
        this.hasFilter = true;
        this.placesFiltered = response;
        loading.dismiss();
        }
        else {
          console.log('No spots around here but check these ones out instead');
          this.searchResults = 'No results in that area. Here are some close by to check out.';

          this._apiService.filterSpaces(payload).subscribe(
            (response: any) => {
              console.log('Response is '+response[0].spaceLocation);
              this.hasFilter = true;
              this.placesFiltered = response;
              loading.dismiss();


            },
            (error: any) => {
              console.error(error);
              this.showToast('Unable to fetch spots');
              loading.dismiss();
            }
          );
        }
      },
      (error: any) => {
        console.error(error);
        this.showToast('Unable to fetch spots');
        loading.dismiss();
      }
    );
  }


  async searchSpaces() {
    const payload = { "param" : this.searchKeyword, "page": this.search_page, "size" : this.page_size };
    const loading = await this.loadingController.create();
    await loading.present();
    this._apiService.searchSpaces(payload).subscribe(
      (response: any) => {
        if (response.length > 0) {
        this.searchResults = '';
        console.log('Response is '+response[0].spaceLocation);
        this.hasFilter = true;
        this.placesFiltered = response;
        loading.dismiss();
        }
        else {
          console.log('No spots around here but check these ones out instead');
          this.searchResults = 'No spots match your keyword.';
          loading.dismiss();
      }
    },
      (error: any) => {
        console.error(error);
        this.showToast('Unable to fetch any spots');
        loading.dismiss();
      }
    );

  }

  ionInfiniteScrollFilter(event: InfiniteScrollCustomEvent) {
    console.log('Fetching filter scroll')
    this.search_page++;
    this.searchSpaces().then(() => event.target.complete());
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
      breakpoints: [0,1],
      initialBreakpoint: 0.7,
      handle: true,

      // componentProps: {
      //   filters: JSON.stringify(this.filters)
      // }
    });

    modal.onDidDismiss()
    .then((data) => {
      console.log(data.data.data[0].spaceLocation);
      this.hasFilter = true;
      this.placesFiltered = data.data.data;
  });




    return await modal.present();
  }

  place(place: any) {
    console.log('Place is '+place.spaceLocation);
    let navigationExtras: NavigationExtras = {
      state: {
        visitStartTime: place.visitStartTime,
        visitEndTime: place.visitEndTime,
        place: place
      }
    };
    this.router.navigateByUrl(`/space-detail/${place.spaceId}`, navigationExtras);
  }

  space(place: any) {
    console.log('Place is '+place.spaceLocation);
    let navigationExtras: NavigationExtras = {
      state: {
        place: place
      }
    };
    this.router.navigateByUrl(`/host-space-detail/${place.spaceId}`);
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
    this.searchResults = '';
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
        this.showToast('Try to star new spot!');
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
      const loading = await this.loadingController.create();
      await loading.present();
      try {


        if (this.userId) {
          const spaceData = {"userId" : this.userId, "preference" : "all"};
          this._apiService.viewAllSpacesByUser(spaceData).subscribe(
            (response: any) => {
              loading.dismiss();
              if(response == null) {
                this.showToast('You do not have any spots');
              }
              else {
                this.spaces = response;
              }

            },
            (error: any) => {
              console.error(error);
              loading.dismiss();
              this.showToast('Unable to fetch any spots');

              // this.showErrorAlert('Unexpected error occurred');
            }
          );
        }
      } catch (error) {
        loading.dismiss();
        console.error(error);
      }


    }




    async getAccountBalance() {

      try {
        const loading = await this.loadingController.create();
        await loading.present();

        if (this.userId) {
          const userData = {"userId" : this.userId};
          this._apiService.fetchAccountBalance(userData).subscribe(
            (response: any) => {
              loading.dismiss();
              console.log(response);
              if(response === null) {
                this.balance = 0;
                this.withdrawnBalance = 0;
              } else {
                const [balance, withdrawnBalance] = response.split('~~').map(Number);
                this.balance = isNaN(balance) ? 0 : balance;
                this.withdrawnBalance = isNaN(withdrawnBalance) ? 0 : withdrawnBalance;
                this.userService.setBalance(this.balance);
              }
            },
            (error: any) => {
              console.error(error);
              loading.dismiss();
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
              this.showToast('Unable to Fetch Any Spots');
            }
          );

    }


    async getSpacesAround(page: number, size: number) {
      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      const loading = await this.loadingController.create();
      await loading.present();

      try {
        if (this.userId) {
          const spaceData = { latitude: this.lat, longitude: this.long, page: page, size: size };
          this._apiService.getSpacesAround(spaceData).subscribe(
            (response: any) => {
              loading.dismiss();
              this.isLoading = false;

              if (page === 0) {
                this.placesAround = response;
              } else {
                this.placesAround = [...this.placesAround, ...response];
              }

              if (response.length < size) {
                if (this.infiniteScroll) {
                  this.infiniteScroll.disabled = true;
                }
              }
            },
            (error: any) => {
              console.error(error);
              loading.dismiss();
              this.isLoading = false;
              this.showToast('Unable to fetch any spots');
            }
          );
        }
      } catch (error) {
        this.isLoading = false;
        console.error(error);
      } finally {
          this.isSpinning = false;
      }
    }

    doRefresh(event: any) {
      console.log('Refreshing data...');
      this.clearFilters()
      this.getSpacesAround(0, this.page_size);

      setTimeout(() => {
        event.target.complete();
      }, 2000);
    }


    ionInfiniteScroll(event: InfiniteScrollCustomEvent) {
      console.log('Fetching scroll')
      this.current_page++;
      this.getSpacesAround(this.current_page, this.page_size).then(() => event.target.complete());
    }



    async getSpaces(size: number) {

      if (this.isLoading) {
        return;
      }

      try {
        this.isLoading = true;
        this.current_page++;
          const spaceData = {"latitude" : this.lat, "longitude" : this.long, "page": this.current_page, "size" : size};
          this._apiService.getSpacesAround(spaceData).subscribe(
            (response: any) => {
              this.isLoading = false;
              this.placesAround = [...this.placesAround, ...response];
              if (response.length === 0 && this.placesAround.length > 0) {
                if (this.infiniteScroll) {
                  this.infiniteScroll.disabled = true;
                }
              } else if (this.infiniteScroll && this.infiniteScroll.disabled) {
                this.infiniteScroll.disabled = false;
              }
            },
            (error: any) => {
              console.error(error);
              this.isLoading = false;
              this.showToast('Unable to fetch any spots');
            }
          );
      } catch (error) {
        console.error(error);
      }

    }


}

