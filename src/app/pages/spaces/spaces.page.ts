import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder/ngx';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api-service.service';
import { TimeSlotModalPage } from '../time-slot-modal/time-slot-modal.page';
import { HttpClient } from '@angular/common/http';
import { TimeSlots } from 'src/app/shared/time-slots';


declare var google: any;



@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.page.html',
  styleUrls: ['./spaces.page.scss'],
})
export class SpacesPage implements OnInit {
  @ViewChild('svgContainer', { static: false }) svgContainer: ElementRef;

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
  fileList: FileList;
  endTimeError: boolean = false;
  role: string;
  isCostPerHour: boolean = false;

  compressedImage: string = '';
  compressedImages: string[] = [];


  // availableTimeSlots: any[] = [];
  availableTimeSlots: TimeSlots[] = [];
  date: string = ''; // Selected date
  startTime: string = ''; // Start time
  endTime: string = ''; // End time
  startDateExpanded: any;
  endDateExpanded: any;
  imageCount: number = 0;
  imageThumbnails: string[] = [];
  imageGuideError: boolean = false;
  



  constructor(
    private formBuilder: FormBuilder,
    private userService : UserService,
    private geolocation : Geolocation,
    public zone: NgZone,
    private loadingController: LoadingController,
    private router: Router,
    private apiService: ApiService,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private http: HttpClient,
  ) {

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.newRule = { input: '' };
    this.imageThumbnails = [];

    this.userDetails = this.userService.getUserDetails();
    this.userId = this.userDetails?.userId;
    this.role = this.userDetails?.role;
    this.firstName = this.userDetails?.firstName || 'Guest';

    this.spaceForm = this.formBuilder.group({
      spaceLocation: new FormControl("", Validators.required),
      spotName: new FormControl("", Validators.required),
      locationDescription: new FormControl("", Validators.required),
      locationGuideImage: new FormControl<File[]>([], Validators.required),
      userId: this.userId,
      spaceType: new FormControl("", Validators.required),
      spaceImage: new FormControl<File[]>([], Validators.required),
      // spaceImage: new FormControl([], Validators.required),
      spaceRules: new FormControl(this.rules),
      isChargePerHour: new FormControl(true),
      description: new FormControl("", Validators.required),
      chargePerDay: new FormControl("", Validators.required),
      size: new FormControl("", Validators.required),
      timeSlot: new FormControl(this.availableTimeSlots),
      practice: ['yes'],
      musicDetails: new FormControl("", Validators.required),
      additionalDetails: new FormControl("https://", [
        Validators.required,
        Validators.pattern(/^(ftp|http|https):\/\/[^ "]+$/)
      ]),
    });
    
   }

  ngOnInit() {
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

  onCheckboxChange(event: any) {
    this.isCostPerHour = event.detail.checked;
    console.log('Checkbox value changed:', this.isCostPerHour);
  }

  fetchSvgFile(svgPath: string) {
    console.log('Fetching data::::::');
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




  async openTimeModal() {

    const modal = await this.modalCtrl.create({
      component: TimeSlotModalPage,
      breakpoints: [0, 0.5, 1], 
      initialBreakpoint: 0.8,
      handle: true,
      componentProps: {
        availableSlots: this.availableTimeSlots
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data && data.startDate && data.startTime && data.endTime) {

      
      this.addTimeSlot(data.startDate, data.startTime, data.endTime);

    }
  }



  addTimeSlot(startDate: any, startTime: any, endTime: any) {
    const day = this.getDayOfWeek(new Date(this.date));
    const newTimeSlot = new TimeSlots(startDate, startTime, endTime);
    this.availableTimeSlots.push(newTimeSlot);

    console.log(this.availableTimeSlots);
  }

  removeTimeSlot(index: number) {
    this.availableTimeSlots.splice(index, 1);
  }

  getDayOfWeek(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  async openDateModal() {
    // const modal = await this.modalCtrl.create({
    //   component: DateModalComponent,
    // });
    // modal.onDidDismiss().then((data: any) => {
    //   if (data && data.data && data.data.selectedDate) {
    //     console.log('Selected date:', data.data.selectedDate);
    //     // Handle the selected date here
    //   }
    // });
    // return await modal.present();
  }




  onEndTimeChange(event: any) {
    const startTime = this.spaceForm.get('visitStartTime')?.value;
    const endTime = event.target.value;
    // Perform validation check
    if (startTime && endTime && startTime > endTime) {
      this.endTimeError = true;
    } else {
      this.endTimeError = false;
    }
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
      timeSlot: 'Time Slots',
      practice: 'Practice Option',
      musicDetails: 'Music Details',
      additionalDetails: 'Video URL',
      locationDescription: 'Location Description',
      locationGuideImage: 'Guide images'
    };

    const invalidControls: any = [];
    // Iterate through form controls and check their validity
    Object.keys(this.spaceForm.controls).forEach(key => {
      const control = this.spaceForm.get(key);
      if (control && control.invalid) {
        const controlName = (controlNames as any)[key] || key;
        invalidControls.push(controlName);
      }
    });

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
    if (this.newRule.input !== '') {
      this.rules.push(this.newRule.input);
      this.newRule.input = '';
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

    this.checkFormValidity();

    if(this.spaceForm.valid) {
      console.log(this.spaceForm)

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
                let navigationExtras: NavigationExtras = {
                  state: {
                    navigationData: true
                  }
                };
                this.router.navigateByUrl(`/tabs`, navigationExtras);
                  // this.router.navigateByUrl('/tabs', { replaceUrl: true });             
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

    await alert.present();
  }

  get spaceTypeFormArray() {
    return this.spaceForm.get('spaceType') as FormArray;
  }


  useCurrentLocation(){
    if(this.lat && this.long){
      this.filters['location'] = [this.lat,this.long];
    }
  }



  onFileChange(event: Event) {

    const target = event.target as HTMLInputElement;
    const files = target.files;
    const spaceFormName = target.name;
    this.imageThumbnails = [];
  
    this.totalSize = 0;
    this.largestFileSize = 0;
    this.imageCount = 0;
    
   

  
    if (files && files.length > 0) {
  
      this.imageCount = files.length;
      const promises: Promise<File>[] = [];
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.totalSize += file.size;
  
        if (file.size > this.largestFileSize) {
          this.largestFileSize = file.size;
        }
  
        if (file) {
          const filePromise = new Promise<File>((resolve, reject) => {
            this.userService.compressImage(file).then((compressedFile) => {
              const url = URL.createObjectURL(compressedFile);
              this.imageThumbnails.push(url);
    
              resolve(compressedFile);
            }).catch((error) => {
              reject(error); 
            });
          });
    
          promises.push(filePromise);
        }
        
        
      }
  
  
      // Update message display based on total size and largest file size
      const maxTotalUploadMessage = document.getElementById('max-total-upload-message');
      const maxUploadPerFileMessage = document.getElementById('max-upload-per-file-message');
  
      if (maxTotalUploadMessage) {
        maxTotalUploadMessage.style.display = this.totalSize > 10 * 1024 * 1024 ? 'block' : 'none';
      }
  
      if (maxUploadPerFileMessage) {
        maxUploadPerFileMessage.style.display = this.largestFileSize > 5 * 1024 * 1024 ? 'block' : 'none';
      }

  
  
      Promise.all(promises)
        .then((file) => {
          this.spaceForm.patchValue({
            [spaceFormName]: file,
          });
        })
        .catch((error) => {
          console.error('Error setting files:', error);
        });
    }
  }


  fileChangeAction(event: Event) {

    const target = event.target as HTMLInputElement;
    const files = target.files;
    const spaceFormName = target.name;

    this.totalSize = 0;
    this.largestFileSize = 0;
    
   

    if(files && files.length > 6) {
      console.log('Image has errors')
      this.imageGuideError = true;
      alert('You can upload a maximum of 6 images.');
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if(fileInput) {
        fileInput.value = ''
      }
      return;
    }
  
    if (files && files.length > 0) {
  
      // this.imageCount = files.length;
      let totalSize = 0;
      let largestFileSize = 0;
      const promises: Promise<File>[] = [];
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        totalSize += file.size;
  
        if (file.size > this.largestFileSize) {
          largestFileSize = file.size;
        }
  
        if (file) {
          const filePromise = new Promise<File>((resolve, reject) => {
            this.userService.compressImage(file).then((compressedFile) => {
              resolve(compressedFile);
            }).catch((error) => {
              reject(error); 
            });
          });
          promises.push(filePromise);
        }
        
        
      }

      if(totalSize > 10 * 1024 * 1024 || largestFileSize > 5 * 1024 * 1024) {
        console.log('Image has errors')
        this.imageGuideError = true;
      }
      else{
        this.imageGuideError = false
      }

  
      const maxTotalUploadMessage = document.getElementById('max-total-upload-guide');
      const maxUploadPerFileMessage = document.getElementById('max-upload-per-file-guide');
  
      if (maxTotalUploadMessage) {
        maxTotalUploadMessage.style.display = totalSize > 10 * 1024 * 1024 ? 'block' : 'none';
      }
  
      if (maxUploadPerFileMessage) {
        maxUploadPerFileMessage.style.display = largestFileSize > 5 * 1024 * 1024 ? 'block' : 'none';
      }
  
  
      Promise.all(promises)
        .then((file) => {
          this.spaceForm.patchValue({
            [spaceFormName]: file,
          });
        })
        .catch((error) => {
          console.error('Error setting files:', error);
        });
    }
  }

  
  

  
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

}
