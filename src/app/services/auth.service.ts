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
  private signUpUrl = 'http://localhost:8088/users/create';
  private loginUrl = 'http://localhost:8088/users/authenticate';


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


