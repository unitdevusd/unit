import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AlertController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { GlobalService } from 'src/app/services/global.service';
import { ToastService } from 'src/app/services/toast.service';
import { CTA, KEY, config } from 'src/environments/environment';
// import { Plugins} from '@capacitor/core';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  private url: any = config.url;
  logged: boolean = false;
  public settingPages = [
    {
      title: 'Password',
      url: '/change-password',
      icon: '../../assets/imgs/feather-lock.png'
    }
  ];
  email: any;
  name: any;
  lastName: any;
  profileImage: any;
  permissionlist: any;
  version: any;
  permission = {
    canCreateSpace: false,
    earningcanRetrive: false,
    paymentCanpay: false,
    canviewAdditionalInfo: false,
    canSendInvite: false,
    canBook: false
  };
  phone: any;
  orgId: any;
  userId: any;
  token: any;
  whitelistRoles: any;


  constructor(
    private storage: Storage,
    private _gs: GlobalService,
    private alertCtrl: AlertController,
    private router: Router,
    private _toast: ToastService,
    private socialSharing: SocialSharing,
    private appVersion: AppVersion,
    private navController: NavController,
    private _apiService: ApiService,
    private renderer: Renderer2

  ) { 
    this.getRole();
    this.appVersion.getVersionCode().then(res => {
      this.version = res;
    }).catch(error => {
      console.log(error);
    });
    this._gs.getData().subscribe(x => {
      if (x != undefined) {
        let user = x;
        this.getUserData(user);
      }
    });

    this._gs.getUpdatedTabs().subscribe(status => {
      if (status) {
        console.log(status.permissions);
        this.permissionlist = status.permissions;
        this.setPermissions();
      }
    });

    this._gs.getLogOut().subscribe(status => {
      this.logged = false;
    });

    this.storage['get']("session").then((session: any) => {
      if (session) {
        this.storage['get']("org").then((org: any) => {
          if (org) {
            this.token = session;
            this.orgId = org;
          }
        });
      }
    });

  }

  getRole() {
    const params = {
      apiKey: KEY.apikey
    }
    this._apiService
      .postRequest(this.url + URL, params)
      .subscribe(async (res) => {
        if (res.success) {
          this.whitelistRoles = res.data.roles;
        }
      })
  }
  setPermissions() {
    this.permission.canCreateSpace = this.permissionlist.includes("unit.space.canCreate");
    this.permission.paymentCanpay = this.permissionlist.includes("unit.booking.payment.canPay");
    this.permission.earningcanRetrive = this.permissionlist.includes("unit.myearnings.canRetrive");
    this.permission.canviewAdditionalInfo = this.permissionlist.includes("unit.user.canViewInfo");
    this.permission.canBook = this.permissionlist.includes("unit.space.canBook");
    this.permission.canSendInvite = this.permissionlist.includes("unit.invite.canSendEmail" || "unit.invite.canSendSMS");
  }
  toggleTheme(event: any) {
    if (event.detail.checked) {
      document.body.setAttribute('color-theme', 'dark');
      // this.renderer.setAttribute(document.body, 'color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
      // this.renderer.setAttribute(document.body, 'color-theme', 'dark');
    }
  }

  getUserData(user?: any) {
    console.log(user);
    if (user) {
      this.updateUser(user);
    } else {
      console.log('In');
      this.storage['get']('user').then((user: any) => {
        if (user) {
          this.updateUser(user);
        }
      });
      this.storage['get']('permissions').then((permissions: any) => {
        if (permissions) {
          this.permissionlist = permissions;
          this.setPermissions();
        }
      });
    }
  }

  updateUser(user: any) {
    this.logged = true;
    this.email = user.email;
    this.name = user.firstName;
    this.lastName = user.lastName;
    this.phone = user.phone;
    if (user.profilePic) {
      this.profileImage = user.profilePic;
    } else {
      this.profileImage = "";
    }
  }

  ngOnInit() {
    this.getUserData();
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'LogOut',
      message: 'Are you sure,you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { }
        }, {
          text: 'Logout',
          handler: () => {
            this.clearAll();
          }
        }
      ]
    });

    await alert.present();
  }
  clearAll() {
    // setTimeout(() => {
    //   this.storage.clear().then(() => {
    //     console.log('all keys cleared');
    //   });
    //   this.logged = false;
    //   this._gs.logOut();
    //   this._gs.sendData(false);
    //   this.navController.navigateRoot(['tabs/tab1']);
    // }, 200);
  }

  logIn() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        from: 'tabs/profile'
      }
    }
    this.router.navigate(['login'], navigationExtras);
  }

  // chooseRole() {
  //   if (!this.token && !this.orgId) {
  //     return false;
  //   }
  //   this._apiService
  //     .postRequest(this.url + UNITURL.updateRole, { token: this.token, orgId: this.orgId, whiteRoles: this.whitelistRoles }).subscribe(
  //       (res) => {
  //         if (res.success) {
  //           this.storage.set("permissions", res.data);
  //           this._gs.updateTabs({
  //             orgId: this.orgId,
  //             token: this.token,
  //             permissions: res.data
  //           });
  //         }
  //       }, (error) => console.log(error)
  //     )
  // }

  async invite() {
    console.log('Invite send');
    this.router.navigate(['invite']);
  }

  async consultLawyer() {
    const alert = await this.alertCtrl.create({
      header: 'Consult Lawyer',
      message: 'We will set you up with a free consultation before recommending you to a legal professional. Is this OK?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { }
        }, {
          text: 'Yes',
          handler: () => {
            this.consult();
          }
        }
      ]
    });
    await alert.present();
  }

  consult() {
    this.storage['get']("org").then((org: any) => {
      if (org) {
        this.orgId = org;
        this.storage['get']("loggedUserId").then((userId: any) => {
          this.userId = userId;
        });
      }
    });
    let type = 'Legal Advice.';
    let cta_Data = {
      meta: {
        emailId: this.email,
        firstName: this.name,
        lastName: this.lastName,
        contactNumber: this.phone
      },
      subject: "Legal Advice.",
      message: "new lead"
    };
    this._apiService
      .postRequest(this.url + CTA.url + this.userId + "/" + this.orgId + "?type=" + type + "&isOpportunity=true", cta_Data).subscribe(
        (response) => console.log(response),
        (error) => console.log(error)
      )
    console.log('consult');
    this._toast.presentToast('Legal Team will contact you soon!');
  }

  navigateHost() {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        priviousPage: 'tabs/profile'
      }
    }
    this.router.navigate(['add-address'], navigationExtras);
  }

  becomeHost() {
    console.log('become Host');
  }
  becomeTenant() {
    console.log('become Tenant');
  }

  // async terms() {
  //   await Browser.open({ url: 'https://unitpublicstorage.com/privacy-policy.html' });
  // }
  // async privacy() {
  //   await Browser.open({ url: 'https://unitpublicstorage.com/privacy-policy.html' });
  // }

}
