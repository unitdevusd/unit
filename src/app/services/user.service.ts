import { Injectable } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private imageCompress: NgxImageCompressService
  ) { }

  private userDetailsKey: 'response';
  private balanceKey = 'bakanceResponse';
  


  setUserDetails(details: any) {
    localStorage.setItem(this.userDetailsKey, JSON.stringify(details));
  }

  getUserDetails(): any {
    const storedDetails = localStorage.getItem(this.userDetailsKey);
    return storedDetails ? JSON.parse(storedDetails) : null;
  }

  clearUserDetails(): any {
    localStorage.removeItem(this.userDetailsKey);
  }


  setBalance(balance: number) {
    localStorage.setItem(this.balanceKey, balance.toString());
  }
  
  getBalance(): number {
    const storedDetails = localStorage.getItem(this.balanceKey);
    const balance = parseFloat(storedDetails ?? '0');
    // Check if the parsed value is a valid number, otherwise return 0
    return isNaN(balance) ? 0 : balance;
  }


  compressImage(file: File): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imgElement = new Image();
        imgElement.src = event.target!.result as string;
  
        imgElement.onload = () => {
          this.imageCompress.compressFile(
            imgElement.src,
            -1,  // Source type (-1 means source is base64)
            80,  // Image quality (0-100)
            500, // Max width (px)
            500  // Max height (px)
          ).then((compressedResult) => {
            // Convert the compressed base64 string into a Blob
            const byteArray = this.dataURItoBlob(compressedResult);
  
            resolve(new File([byteArray], file.name, { type: 'image/jpeg' }));
          }).catch((compressionError) => {
            reject(compressionError);
          });
        };
  
        imgElement.onerror = (error) => {
          reject(error); 
        };
      };
  
      reader.onerror = (error) => {
        reject(error);  
      };
  
      reader.readAsDataURL(file);
    });
  }
  
  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ua = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ua[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }


encrypt(data: string): string {
    const key = CryptoJS.enc.Utf8.parse('8966354631572579');
    const iv = CryptoJS.enc.Utf8.parse('8966354631572579');

    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();

    return encrypted;
}

decrypt(encryptedData: string): string {
    const key = CryptoJS.enc.Utf8.parse('8966354631572579');
    const iv = CryptoJS.enc.Utf8.parse('8966354631572579');

    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    return decryptedText;
}
}

  
