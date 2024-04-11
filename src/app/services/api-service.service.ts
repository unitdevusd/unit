import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  jsonData: any;
  private baseUrl = 'https://unitsession.com/';
  // private baseUrl = 'http://localhost:8088/';
  private viewSpaces = this.baseUrl+'spaces/getSpaces';
  private addSpaces = this.baseUrl+'spaces/add-space';
  private spacesAround = this.baseUrl+'map/getnearestlocations';
  private findSpace = this.baseUrl+'spaces/findById';
  private bookSpaceUrl = this.baseUrl+'spaces/book-space';
  private updateRoleUrl = this.baseUrl+'users/updateUserRole';
  private tenantSpacesUrl = this.baseUrl+'spaces/getbookedspaces';
  private spaceImagesUrl = this.baseUrl+'spaces/getSpaceImages';
  private filterSpacesUrl = this.baseUrl+'map/filterspaces';
  private filterSpacesRadiusUrl = this.baseUrl+'map/filterspacesbyradius';
  private accountBalanceUrl = this.baseUrl+'payment/account-balance';
  private deleteSpaceUrl = this.baseUrl+'spaces/deleteById';
  private updateRulesUrl = this.baseUrl+'spaces/updateRulesById';
  private updateImagesUrl = this.baseUrl+'spaces/updateSpaceImages';
  private filterPreferenceUrl =  this.baseUrl+'spaces/filterspacesbyPreference';
  private updateLocationUrl =  this.baseUrl+'spaces/updateLocationById';
  private updateYoutubeUrl =  this.baseUrl+'spaces/updateUrlById';
  private removeSpaceUrl = this.baseUrl+'spaces/removeSpace';
  private allUsersUrl = this.baseUrl+'users/getUsers';
  private modifyUserUrl = this.baseUrl+'users/modify-user';
  private updateProfilePicUrl = this.baseUrl+'users/updatePicture';
  private fetchAccountsUrl = this.baseUrl+'payment/getAccounts';
  private addAccountUrl = this.baseUrl+'payment/add-accounts';
  private payoutUrl =  this.baseUrl+'crypto/withdraw';
  private profilePicUrl = this.baseUrl+'users/getPicture';
  private generateChargesUrl = this.baseUrl+'crypto/getCharges';
  private trackChargesUrl = this.baseUrl+'crypto/track-charges';
  private getRatesUrl = this.baseUrl+'crypto/rates';
  private deleteBankUrl = this.baseUrl+'payment/deleteAccounts';


  constructor(public http: HttpClient) { }

  private extractData(res: any) {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.log(error);
    }
    return throwError(
      'Something bad happened; please try again later.');
  };

  /*
  POST REQUEST 
  */
  postRequest(url: string, param: any) {
    return this.http
      .post(url, param)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      )
  }

  /*
  GET REQUEST 
  */
  getRequest(url: string) {
    return this.http
      .get(url)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      )
  }

  uploadBase64image(url: string, params: { base64: any; }) {
    return new Promise((resolve, reject) => {
      if (!params.base64) {
        resolve({ success: false, message: 'Image data is requried.' });
      }
      console.log(params);
      this.http.post(url, params).subscribe((result: any) => {
        console.log(result);
        resolve(result);
      },

      /*
      console.log(params);
      return this.http.post('https://unit-storage-default-rtdb.firebaseio.com/offered-places.json', {...newPlace, id: null}).subscribe((result: any) => {
        console.log(result);
        resolve(result);
      },
      */
        (error) => {
          console.log(error);
          resolve({ success: false, message: error });
        });
    });
  }


  viewAllSpacesByUser(payload: any): Observable<any> {
    return this.http.post(this.viewSpaces, payload);
  }

  // uploadSpace(payload: any): Observable<any> {
  //   return this.http.post(this.addSpaces, payload);
  // }



  // uploadSpace(payload: any): Observable<any> {
  //   const formData = new FormData();
  //   Object.keys(payload).forEach((key) => {
  //     formData.append(key, payload[key]);
  //   });

  //   return this.http.post(this.addSpaces, formData);
  // }



  uploadSpace(payload: any): Observable<any> {
    const formData = new FormData();
  
    // Append non-file fields to formData
    for (const key of Object.keys(payload)) {
      if (key !== 'image') {
        formData.append(key, payload[key]);
      }
    }
  
    // Append files under 'image' key
    if (payload.spaceImage && Array.isArray(payload.spaceImage)) {
      for (let i = 0; i < payload.spaceImage.length; i++) {
        formData.append('spaceImage', payload.spaceImage[i]);
      }
    }
  
    // Make the POST request with formData
    return this.http.post(this.addSpaces, formData);
  }



  getSpacesAround(payload: any): Observable<any> {
    return this.http.post(this.spacesAround, payload);
  }

  getSpaceBySpaceId(payload: any): Observable<any> {
    return this.http.post(this.findSpace, payload);
  }

  bookSpace(payload: any): Observable<any> {
    return this.http.post(this.bookSpaceUrl, payload);
  }

  updateUserRole(payload: any): Observable<any> {
    return this.http.post(this.updateRoleUrl, payload);
  }

  // updateProfilePicture(payload: any): Observable<any> {
  //   return this.http.post(this.updateProfilePicUrl, payload);
  // }


  updateProfilePicture(payload: any): Observable<any> {
    // Create FormData object
    const formData = new FormData();
    // Append form fields to FormData object
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    // Send POST request with form data
    return this.http.post(this.updateProfilePicUrl, formData);
  }


  


  fetchTenantSpaces(payload: any): Observable<any> {
    return this.http.post(this.tenantSpacesUrl, payload);
  }

  fetchUsers(payload: any): Observable<any> {
    return this.http.post(this.allUsersUrl, payload);
  }

  modifyUser(payload: any): Observable<any> {
    return this.http.post(this.modifyUserUrl, payload);
  }

  retrieveSpaceImages(payload: any): Observable<any> {
    return this.http.post(this.spaceImagesUrl, payload);
  }

  // filterSpaces(address: string): Observable<any> {
  //   console.log('Address is '+address);
  //   const params = new HttpParams().set('address', address); 
  //   return this.http.get(this.filterSpacesUrl, { params });
  // }

  filterSpaces(payload: any): Observable<any> {
    console.log(payload);
    return this.http.post(this.filterSpacesUrl, payload);
  }

  filterCloseSpaces(payload: any): Observable<any> {
    console.log(payload);
    return this.http.post(this.filterSpacesRadiusUrl, payload);
  }

  fetchAccountBalance(payload: any): Observable<any> {
    return this.http.post(this.accountBalanceUrl, payload, { responseType: 'text' });
  }

  deleteSpace(payload: any): Observable<any> {
    return this.http.post(this.deleteSpaceUrl, payload, { responseType: 'text' });
  }

  removeSpace(payload: any): Observable<any> {
    return this.http.post(this.removeSpaceUrl, payload, { responseType: 'text' });
  }

  generateCharges(payload: any): Observable<any> {
    return this.http.post(this.generateChargesUrl, payload, { responseType: 'text' });
  }

  trackCharges(payload: any): Observable<any> {
    return this.http.post(this.trackChargesUrl, payload, { responseType: 'text' });
  }

  convertToBtc(): Observable<string> {
    return this.http.get(this.getRatesUrl, { responseType: 'text' });
  }

  deleteBankDetails(payload: any): Observable<string> {
    return this.http.post(this.deleteBankUrl, payload, { responseType: 'text' });
  }
 
  

  updateRules(payload: any): Observable<any> {
    return this.http.post(this.updateRulesUrl, payload);
  }

  updateImages(payload: any): Observable<any> {
    return this.http.post(this.updateImagesUrl, payload);
  }

  filterPreference(payload: any): Observable<any> {
    return this.http.post(this.filterPreferenceUrl, payload);
  }

  updateLocation(payload: any): Observable<any> {
    return this.http.post(this.updateLocationUrl, payload);
  }

  updateUrl(payload: any): Observable<any> {
    return this.http.post(this.updateYoutubeUrl, payload);
  }

  fetchAllAccounts(payload: any): Observable<any> {
    return this.http.post(this.fetchAccountsUrl, payload);
  }

  addAccount(payload: any): Observable<any> {
    return this.http.post(this.addAccountUrl, payload);
  }

  makePayment(payload: any): Observable<any> {
    return this.http.post(this.payoutUrl, payload, { responseType: 'text' });
  }


  findProfilePic(payload: any): Observable<any> {
    return this.http.post(this.profilePicUrl, payload, { responseType: 'text' });
  }
}
