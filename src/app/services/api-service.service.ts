import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Observable, from, throwError } from 'rxjs';
import { JwtService } from './jwt.service'; 

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  jsonData: any;
  // private baseUrl = 'https://unit-session.com/';
  private baseUrl = 'http://localhost:8088/';
  private viewSpaces = this.baseUrl+'spaces/getSpaces';
  private cancelBookingUrl = this.baseUrl+'spaces/cancel-booking'
  private bookedspacesforhosturl = this.baseUrl+'spaces/getbookedspacesforhost';
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
  private updateTimeSlotUrl = this.baseUrl+'spaces/updateTimeSlot';
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
  private refreshTokenUrl = this.baseUrl+'users/refreshToken';
  private biometricsUrl = this.baseUrl+'users/setBiometrics';
  private rateSpaceUrl = this.baseUrl+'spaces/rate-space';
  private crewNameUrl = this.baseUrl+'users/create-crew';


  constructor(public http: HttpClient, private jwtService: JwtService) { }

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

        (error) => {
          console.log(error);
          resolve({ success: false, message: error });
        });
    });
  }

  viewAllSpacesByUser(payload: any): Observable<any> {
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.viewSpaces, payload, { headers });
      })
    );
  }

  viewbookedspacesforhost(payload: any): Observable<any> {
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.bookedspacesforhosturl, payload, { headers });
      })
    );
  }

  cancelBooking(payload: any): Observable<any> {
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.cancelBookingUrl, payload, { headers });
      })
    );
  }

  // viewAllSpacesByUser(payload: any): Observable<any> {
  //   return this.http.post(this.viewSpaces, payload);
  // }

  uploadSpace(payload: any): Observable<any> {
    const formData = new FormData();
  
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

    if (payload.locationGuideImage && Array.isArray(payload.locationGuideImage)) {
      for (let i = 0; i < payload.locationGuideImage.length; i++) {
        formData.append('locationGuideImage', payload.locationGuideImage[i]);
      }
    }

    formData.append('timeSlots', JSON.stringify(payload.timeSlot));
    // Make the POST request with formData
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        // Make the POST request with formData and headers
        return this.http.post(this.addSpaces, formData, { headers });
      })
    );  
  }



  getSpacesAround(payload: any): Observable<any> {
    // return this.http.post(this.spacesAround, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        // Make the POST request with formData and headers
        return this.http.post(this.spacesAround, payload, { headers });
      })
    );
  }

  getSpaceBySpaceId(payload: any): Observable<any> {
    // return this.http.post(this.findSpace, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        // Make the POST request with formData and headers
        return this.http.post(this.findSpace, payload, { headers });
      })
    );

    
  }

  bookSpace(payload: any): Observable<any> {
    // return this.http.post(this.bookSpaceUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        // Make the POST request with formData and headers
        return this.http.post(this.bookSpaceUrl, payload, { headers });
      })
    );

  }

  updateUserRole(payload: any): Observable<any> {
    // return this.http.post(this.updateRoleUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        // Make the POST request with formData and headers
        return this.http.post(this.updateRoleUrl, payload, { headers });
      })
    );

  }

  updateTimeSlot(payload: any): Observable<any> {
    // return this.http.post(this.updateTimeSlotUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        // Make the POST request with formData and headers
        return this.http.post(this.updateTimeSlotUrl, payload, { headers });
      })
    );

  }


  updateProfilePicture(payload: any): Observable<any> {
    // Create FormData object
    const formData = new FormData();
    // Append form fields to FormData object
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.updateProfilePicUrl, formData, { headers });
      })
    );

  }


  


  fetchTenantSpaces(payload: any): Observable<any> {
    // return this.http.post(this.tenantSpacesUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        // Make the POST request with formData and headers
        return this.http.post(this.tenantSpacesUrl, payload, { headers });
      })
    );

  }

  fetchUsers(payload: any): Observable<any> {
    // return this.http.post(this.allUsersUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        // Make the POST request with formData and headers
        return this.http.post(this.allUsersUrl, payload, { headers });
      })
    );

  }

  modifyUser(payload: any): Observable<any> {
    // return this.http.post(this.modifyUserUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        // Make the POST request with formData and headers
        return this.http.post(this.modifyUserUrl, payload, { headers });
      })
    );

  }

  retrieveSpaceImages(payload: any): Observable<any> {
    // return this.http.post(this.spaceImagesUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        // Make the POST request with formData and headers
        return this.http.post(this.spaceImagesUrl, payload, { headers });
      })
    );

  }

  // filterSpaces(address: string): Observable<any> {
  //   console.log('Address is '+address);
  //   const params = new HttpParams().set('address', address); 
  //   return this.http.get(this.filterSpacesUrl, { params });
  // }

  filterSpaces(payload: any): Observable<any> {
    // return this.http.post(this.filterSpacesUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        // Make the POST request with formData and headers
        return this.http.post(this.filterSpacesUrl, payload, { headers });
      })
    );

  }

  filterCloseSpaces(payload: any): Observable<any> {
    // return this.http.post(this.filterSpacesRadiusUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        // Make the POST request with formData and headers
        return this.http.post(this.filterSpacesRadiusUrl, payload, { headers });
      })
    );

  }

  fetchAccountBalance(payload: any): Observable<any> {
    // return this.http.post(this.accountBalanceUrl, payload, { responseType: 'text' });
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        // Combine headers and response type into a single options object
        const options = {
          headers,
          responseType: 'text' as const
        };
    
        // Make the POST request with formData and headers
        return this.http.post(this.accountBalanceUrl, payload, options);
      })
    );
  }

  deleteSpace(payload: any): Observable<any> {
    // return this.http.post(this.deleteSpaceUrl, payload, { responseType: 'text' });
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        const options = {
          headers,
          responseType: 'text' as const
        };
    
        // Make the POST request with formData and headers
        return this.http.post(this.deleteSpaceUrl, payload, options);
      })
    );

  }

  removeSpace(payload: any): Observable<any> {
    // return this.http.post(this.removeSpaceUrl, payload, { responseType: 'text' });
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        // Combine headers and response type into a single options object
        const options = {
          headers,
          responseType: 'text' as const
        };
    
        // Make the POST request with formData and headers
        return this.http.post(this.removeSpaceUrl, payload, options);
      })
    );

  }

  generateCharges(payload: any): Observable<any> {
    // return this.http.post(this.generateChargesUrl, payload, { responseType: 'text' });
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        // Combine headers and response type into a single options object
        const options = {
          headers,
          responseType: 'text' as const
        };
    
        // Make the POST request with formData and headers
        return this.http.post(this.generateChargesUrl, payload, options);
      })
    );

  }

  trackCharges(payload: any): Observable<any> {
    // return this.http.post(this.trackChargesUrl, payload, { responseType: 'text' });
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        // Combine headers and response type into a single options object
        const options = {
          headers,
          responseType: 'text' as const
        };
    
        // Make the POST request with formData and headers
        return this.http.post(this.trackChargesUrl, payload, options);
      })
    );

  }

  convertToBtc(): Observable<string> {
    // return this.http.get(this.getRatesUrl, { responseType: 'text' });
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        // Combine headers and response type into a single options object
        const options = {
          headers,
          responseType: 'text' as const
        };
    
        // Make the POST request with formData and headers
        return this.http.get(this.getRatesUrl, options);
      })
    );

  }

  deleteBankDetails(payload: any): Observable<string> {
    // return this.http.post(this.deleteBankUrl, payload, { responseType: 'text' });
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        // Combine headers and response type into a single options object
        const options = {
          headers,
          responseType: 'text' as const
        };
    
        // Make the POST request with formData and headers
        return this.http.post(this.deleteBankUrl, payload, options);
      })
    );

  }
 
  

  updateRules(payload: any): Observable<any> {
    // return this.http.post(this.updateRulesUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.updateRulesUrl, payload, { headers });
      })
    );
  }

  updateImages(payload: any): Observable<any> {
    // return this.http.post(this.updateImagesUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.updateImagesUrl, payload, { headers });
      })
    );
  }

  filterPreference(payload: any): Observable<any> {
    // return this.http.post(this.filterPreferenceUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.filterPreferenceUrl, payload, { headers });
      })
    );
  }

  updateLocation(payload: any): Observable<any> {
    // return this.http.post(this.updateLocationUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.updateLocationUrl, payload, { headers });
      })
    );
  }

  updateUrl(payload: any): Observable<any> {
    // return this.http.post(this.updateYoutubeUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.updateYoutubeUrl, payload, { headers });
      })
    );
  }

  fetchAllAccounts(payload: any): Observable<any> {
    // return this.http.post(this.fetchAccountsUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.fetchAccountsUrl, payload, { headers });
      })
    );
  }

  addAccount(payload: any): Observable<any> {
    // return this.http.post(this.addAccountUrl, payload);
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.addAccountUrl, payload, { headers });
      })
    );
  }

  makePayment(payload: any): Observable<any> {
    // return this.http.post(this.payoutUrl, payload, { responseType: 'text' });
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.payoutUrl, payload, { headers });
      })
    );
  }

  toggleBiometrics(payload: any): Observable<any> {
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.biometricsUrl, payload, { headers });
      })
    );
  }


  findProfilePic(payload: any): Observable<any> {
    // return this.http.post(this.profilePicUrl, payload, { responseType: 'text' });
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        const options = {
          headers,
          responseType: 'text' as const 
        };
    
        return this.http.post(this.profilePicUrl, payload, options);
      })
    );
  }

  sendRefreshToken(payload: any) : Observable<any> {
    return this.http.post(this.refreshTokenUrl, payload);
  }

  rateSpace(payload: any): Observable<any> {
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.rateSpaceUrl, payload, { headers });
      })
    );
  }

  setCrewName(payload: any): Observable<any> {
    return from(this.jwtService.getJwt()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.crewNameUrl, payload, { headers });
      })
    );
  }

}
