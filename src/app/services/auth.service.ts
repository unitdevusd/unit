import { HttpClient } from '@angular/common/http';
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


  createUser(payload: any): Observable<any> {
    return this.http.post(this.signUpUrl, payload);
  }

  authenticateUser(payload: any): Observable<any> {
    return this.http.post(this.loginUrl, payload);
  }

}


