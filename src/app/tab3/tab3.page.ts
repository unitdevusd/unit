import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  firstName: any;
  role: any;
  userId: any;
  darkMode = false;


  constructor(
    private userService : UserService,

  ) {
    const userDetails = this.userService.getUserDetails();
    this.firstName = userDetails?.firstName || 'Guest';
    this.role = userDetails?.role;
    this.userId = userDetails?.userId;
    console.log('First Name is '+this.firstName+ ' and role is '+this.role);

  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  toggleRole() {
    this.role = 'HOST';
    console.log('Before toggle role is '+this.role);

    this.role = this.role === 'HOST' ? 'TENANT' : this.role === 'TENANT' ? 'OTHER_ROLE' : 'HOST';
    console.log('New role is '+this.role);
  }
}
