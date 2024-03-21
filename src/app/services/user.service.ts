import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private userDetailsKey: 'response';
  private balanceKey = 'bakanceResponse';


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


  setBalance(balance: number) {
    localStorage.setItem(this.balanceKey, balance.toString());
  }
  
  getBalance(): number {
    const storedDetails = localStorage.getItem(this.balanceKey);
    const balance = parseFloat(storedDetails ?? '0');
    // Check if the parsed value is a valid number, otherwise return 0
    return isNaN(balance) ? 0 : balance;
  }}
