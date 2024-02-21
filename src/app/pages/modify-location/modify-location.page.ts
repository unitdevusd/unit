import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';

declare var google : any;

@Component({
  selector: 'app-modify-location',
  templateUrl: './modify-location.page.html',
  styleUrls: ['./modify-location.page.scss'],
})
export class ModifyLocationPage implements OnInit {

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  autocompleteItems: any[];
  GoogleAutocomplete: any;
  autocomplete: any;
  autocompletedInput: { input: string; };
  address: string;
  spaceId: any;




  constructor(
    public zone: NgZone,
    public modalController: ModalController,
    private navParams: NavParams,
    private loadingController: LoadingController,
    private apiService: ApiService

  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.spaceId = this.navParams.get('spaceId');


  }

  ngOnInit() {
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


  async modifySpace() {
    const spaceData = {"spaceId" : this.spaceId, "spaceLocation" : this.autocomplete.input};
    const loading = await this.loadingController.create();
    await loading.present();


    this.apiService.updateLocation(spaceData).subscribe(
      (response: any) => {
        loading.dismiss(); 
        this.modalController.dismiss({ updatedSpace: response });

      },
      (error: any) => {
        console.error(error);
        loading.dismiss();
      }
    );

  }


  dismiss() {
    this.modalController.dismiss();
  }


}
