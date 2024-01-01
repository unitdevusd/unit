import { Component } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  private activeTab?: HTMLElement;
  userDetails: any;
  role: any;



  constructor(
    private userService : UserService,

  ) {}



  tabChange(tabsRef: IonTabs) {
    if (tabsRef && tabsRef.outlet && tabsRef.outlet.activatedView) {
      this.activeTab = tabsRef.outlet.activatedView.element;
    } else {
      console.error('tabsRef, outlet, or activatedView is null');
    }
  }

  ionViewWillLeave() {
    this.propagateToActiveTab('ionViewWillLeave');
  }
  
  ionViewDidLeave() {
    this.propagateToActiveTab('ionViewDidLeave');
  }
  
  ionViewWillEnter() {
    this.propagateToActiveTab('ionViewWillEnter');
    this.userDetails = this.userService.getUserDetails();
    this.role = this.userDetails?.role;

  }
  
  ionViewDidEnter() {
    this.propagateToActiveTab('ionViewDidEnter');
  }
  
  private propagateToActiveTab(eventName: string) {    
    if (this.activeTab) {
      this.activeTab.dispatchEvent(new CustomEvent(eventName));
    }
  }

}
