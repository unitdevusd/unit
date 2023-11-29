import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  jsonData: any;
  private viewSpaces = 'http://localhost:8088/spaces/getSpaces';
  private addSpaces = 'http://localhost:8088/spaces/add-space';


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

  uploadSpace(payload: any): Observable<any> {
    return this.http.post(this.addSpaces, payload);
  }


}
