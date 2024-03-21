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
  private baseUrl = 'https://unitsession.com/';
  // private baseUrl = 'http://localhost:8088/';
  private signUpUrl = this.baseUrl+'users/create';
  private loginUrl = this.baseUrl+'users/authenticate';



  constructor(
     private http: HttpClient
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

}


