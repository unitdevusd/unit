import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs/internal/Observable';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userdata: any;
  // private baseUrl = 'https://unit-session.com/';
  private baseUrl = 'http://localhost:8088/';
  private signUpUrl = this.baseUrl+'users/create';
  private loginUrl = this.baseUrl+'users/authenticate';
  private validateUserUrl = this.baseUrl+'users/validateUserEmail';
  private validateOtpUrl = this.baseUrl+'users/validateOtp';
  private resetPasswordUrl = this.baseUrl+'users/resetPassword';
  private biometricsUrl = this.baseUrl+'users/validate-biometrics'
  private socialUrl = this.baseUrl+'users/social-login'


  constructor(
     private http: HttpClient,
     private afAuth: AngularFireAuth
     ) { 
   
  }


  // createUser(payload: any): Observable<any> {
  //   return this.http.post(this.signUpUrl, payload);
  // }

  createUser(payload: any): Observable<any> {
    // Create FormData object
    const formData = new FormData();
    // Append form fields to FormData object
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    // Send POST request with form data
    return this.http.post(this.signUpUrl, formData);
  }

  authenticateUser(payload: any): Observable<any> {
    return this.http.post(this.loginUrl, payload);
  }

  validateEmail(payload: any): Observable<any> {
    return this.http.post(this.validateUserUrl, payload);
  }

  validateOtp(payload: any): Observable<any> {
    return this.http.post(this.validateOtpUrl, payload);
  }

  resetUserPassword(payload: any): Observable<any> {
    return this.http.post(this.resetPasswordUrl, payload);
  }

  validateFingerPrint(payload: any): Observable<any> {
    return this.http.post(this.biometricsUrl, payload);
  }

  socialLoginAuthentication(payload: any): Observable<any> {
    return this.http.post(this.socialUrl, payload);
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}


