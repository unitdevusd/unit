import { Component, OnInit, ViewChild } from '@angular/core';
import { IonAccordion, IonAccordionGroup, IonDatetime, IonItem, ModalController, NavParams } from '@ionic/angular';
import * as moment from 'moment';


@Component({
  selector: 'app-time-slot-modal',
  templateUrl: './time-slot-modal.page.html',
  styleUrls: ['./time-slot-modal.page.scss'],
})
export class TimeSlotModalPage implements OnInit {

  isDateDisabled = (dateString: string): boolean => {
    const formattedDate = this.formatDate(dateString);
    return !this.availableSlots.some(slot => slot.date === formattedDate);
  };



  @ViewChild('accordionGroup') accordionGroup: IonAccordionGroup;
  @ViewChild('startAccordion') startAccordion: IonAccordion; 
  @ViewChild('accordionGroup2') accordionGroup2: IonAccordionGroup;
  @ViewChild('startAccordion2') startAccordion2: IonAccordion; 
  @ViewChild('accordionGroup3') accordionGroup3: IonAccordionGroup;
  @ViewChild('startAccordion3') startAccordion3: IonAccordion; 
  startDate: any;
  startTime: any;
  endTime: any;
  availableSlots: any[];
  displayDate: any = moment().format();


  private formatDate(dateString: string): string {
    const date1 = new Date(dateString);
     const isoDateString= date1.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    return isoDateString;
  }


  constructor(
    private modalController: ModalController,
    private navParams: NavParams) {
      this.availableSlots = this.navParams.get('availableSlots');

    }

  ngOnInit() {

  }


  dismiss() {  
    this.modalController.dismiss({ startDate: this.startDate, startTime: this.startTime, endTime: this.endTime });
  }

  addSlot() {
    this.dismiss();
  }
  
  onStartDateChange(event: any) {
    this.startDate = event.detail.value;
    const date1 = new Date(this.startDate);
    this.startDate= date1.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    this.closeAccordion(this.accordionGroup);
    }

    closeAccordion(accordion: any) {
        accordion.value = '';   
    }

  onStartTimeChange(event: any) {
    this.startTime = event.detail.value;
    console.log(this.startTime);
    if(this.startTime.includes('T')) {
    const date1 = new Date(this.startTime);
    this.startTime = date1.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    }
    this.closeAccordion(this.accordionGroup2);


    }

    onEndTimeChange(event: any) {
      this.endTime = event.detail.value;
      if(this.endTime.includes('T')) {
      const date1 = new Date(this.endTime);
      this.endTime = date1.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      }
      this.closeAccordion(this.accordionGroup3);

      }

}
