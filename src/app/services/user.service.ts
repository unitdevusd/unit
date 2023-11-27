import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private userDetailsKey: 'userDetails';

  setUserDetails(details: any) {
    localStorage.setItem(this.userDetailsKey, JSON.stringify(details));
  }

  getUserDetails(): any {
    const storedDetails = localStorage.getItem(this.userDetailsKey);
    return storedDetails ? JSON.parse(storedDetails) : null;
  }

  clearUserDetails(): any {
    localStorage.removeItem(this.userDetailsKey);
  }
}
