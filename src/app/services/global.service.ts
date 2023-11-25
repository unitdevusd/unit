import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  

  constructor() { }

  private subject = new Subject<any>();
  private status = new Subject<any> ();
  private logout = new Subject<any>();
  private filterObject = new Subject<any>();
  private refresh = new Subject<any> ();
  private refershMyStays = new Subject<any> ();
  private fcmInfo = new Subject<any> ();
  // Used For update  users
  sendData(user: any) {
    this.subject.next(user);
  }

  // clearData() {
  //   this.subject.next();
  // }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }


  // Update tabs
  updateTabs(status: { orgId: any; token: any; permissions: any; }) {
    this.status.next(status);
  }

  getUpdatedTabs(): Observable<any> {
    return this.status.asObservable();
  }

  // logOut 
  logOut(){
    this.logout.next(true);
  }
  getLogOut(): Observable<any> {
    return this.logout.asObservable();
  }


  /*
  REFRESH FILTERS
  */
 setFilterRefresh(refresh: any) {
  this.filterObject.next({ refresh: refresh });
}

applyFilters() {
  return this.filterObject.asObservable();
}

  /*
  REFRESH MY PLACES FOR HOST
  */
 sendRefershScreen(refresh: string) {
  this.refresh.next({ refresh: refresh });
}

getRefreshScreen() {
  return this.refresh.asObservable();
}

// clearRefresh() {
//   this.refresh.next();
// }



/*
  REFRESH MY STAYS
  */

 refreshMyStays(refresh: string) {
  this.refershMyStays.next({ refresh: refresh });
}

getMyStaysRefresh() {
  return this.refershMyStays.asObservable();
}

// clearMyStaysObserver() {
//   this.refershMyStays.next();
// }

/*
FCM data
*/
fcmData(refresh: string) {
  this.fcmInfo.next({ refresh: refresh });
}

getfcmData() {
  return this.fcmInfo.asObservable();
}

// clearfcmData() {
//   this.fcmInfo.next();
// }

}
