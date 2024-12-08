import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {
  @Input() imageUrl: string;
  @Input() fromTab3: boolean;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  profilePictureUrl: any;
  userDetails: any;
  role: any;
  userId: any;



  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private toastController: ToastController
  ) {
    this.userDetails = this.userService.getUserDetails();
    this.role = this.userDetails?.role;
    this.userId = this.userDetails?.userId;

  }

  ngOnInit() {
  }

  dismissModal() {
    this.modalController.dismiss();
  }


  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }


  async onFileSelected(event: any) {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.profilePictureUrl = reader.result as string;
    };
    reader.readAsDataURL(file);


    if (file) {
      const compressedFile = await this.userService.compressImage(file);  
      const base64 = await this.convertToBase64(compressedFile); 
      this.imageUrl = base64;

      await this.modifyProfilePicture(compressedFile);
    }
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }


  async modifyProfilePicture(image: any) {
    const userData = {"userId" : this.userId, "profilePicture" : image};
    console.log(userData)
    const loading = await this.loadingController.create();
    await loading.present();


    this.apiService.updateProfilePicture(userData).subscribe(
      (response: any) => {
        loading.dismiss(); 
        this.modalController.dismiss({ updatedUser: response });

      },
      (error: any) => {
        console.error(error);
        loading.dismiss();
        this.showToast('Please upload a lesser size of 1mb and try again');   

      }
    );

  }

  async showToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }


}
