import { Component, OnInit, ViewChild } from '@angular/core';
import { IonAccordion, IonAccordionGroup, IonDatetime, IonItem, ModalController, NavParams, ToastController } from '@ionic/angular';
import * as moment from 'moment';


@Component({
  selector: 'app-time-slot-modal',
  templateUrl: './time-slot-modal.page.html',
  styleUrls: ['./time-slot-modal.page.scss'],
})
export class TimeSlotModalPage implements OnInit {

  isRecurring: boolean = false;
  recurringOptions: string | null = null;
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
    private toastController: ToastController,
    private navParams: NavParams) {
      this.availableSlots = this.navParams.get('availableSlots');

    }

  ngOnInit() {

  }


  dismiss() {  
    this.modalController.dismiss({ startDate: this.startDate, startTime: this.startTime, endTime: this.endTime,
    repeat: this.isRecurring, repeatOption: this.recurringOptions });
  }

  async addSlot() {
    console.log(this.recurringOptions)
    if(this.isRecurring && this.recurringOptions == null) {
      this.displayToast('Please add your preferred recurring period')
      return; 
    }
    if(this.startDate == null || this.startTime == null || this.endTime == null ||
      this.startDate == '' || this.startTime == '' || this.endTime == '') {
      this.displayToast('Please select date and time')
      return; 
    }

    const hoursDifference = this.calculateTime(this.startTime, this.endTime);    
     console.log(hoursDifference); 
      if(hoursDifference <= 0) {
        this.displayToast('End time should be ahead of the start time');
        return;
      }

    this.dismiss();
  }

  calculateTime(startTimeString: any, endTimeString:any) {
    const today = new Date();
    const startTime = new Date(today.setHours(parseInt(startTimeString.split(":")[0]), parseInt(startTimeString.split(":")[1]), 0, 0));
    const endTime = new Date(today.setHours(parseInt(endTimeString.split(":")[0]), parseInt(endTimeString.split(":")[1]), 0, 0));
    const timeDifferenceInMillis = endTime.getTime() - startTime.getTime();
  
    const hoursDifference = timeDifferenceInMillis / (1000 * 60 * 60);
    return hoursDifference;
  }

  async displayToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();  

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
