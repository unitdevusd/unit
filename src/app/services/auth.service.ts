import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userdata: any;

  constructor(
     public fireAuth: AngularFireAuth,public f: AngularFirestore
     ) { 
    this.fireAuth.authState.subscribe((user) => {
      this.userdata = user ? user : null;
    });
   
  }


  register(email : string, password : string)  {
    return this.fireAuth.createUserWithEmailAndPassword(email, password).then(userCredential => {
      const user = userCredential.user;
      console.log('User created:', user);
    
      return userCredential;

    }).catch((error: any) => {
      console.log('error', error);
      return error;
    });
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<any> {
    return await this.fireAuth.signInWithEmailAndPassword(email,password);
  }

  saveAdditionalUserData(userId: string, additionalData: any){
    const userRef = this.f.collection('users').doc(userId);
    return userRef.set(additionalData, { merge: true })
    .then(() => {
      console.log('Additional data saved');
    })
    .catch((error) => {
      console.error('Error saving additional data:', error);
    });
  }

}


