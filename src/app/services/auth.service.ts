import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userdata: any;

  constructor( public fireAuth: AngularFireAuth) { 
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

}


