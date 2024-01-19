import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-service.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-shared-host-space',
  templateUrl: './shared-host-space.component.html',
  styleUrls: ['./shared-host-space.component.scss'],
})
export class SharedHostSpaceComponent  implements OnInit {

  @Input() spaces: any;
  @Output() spaceSelected = new EventEmitter();
  @Output() clearAll = new EventEmitter();

  userId: any;
  // spaces: any[] = [];
  clearFilter: boolean;
  spaceFilters: any = [];


  constructor(
    private userService : UserService,
    private router : Router,
  ) { 

    const userDetails = this.userService.getUserDetails();
    this.userId = userDetails?.userId;
  }

  ngOnInit() {}


  spaceClick(space: { status: boolean; _id: any; }){
    this.clearFilter = true;
    if (space.status) {
      space.status = false;
      const index: number = this.spaceFilters.indexOf(space._id);
      if (index !== -1) {
        this.spaceFilters.splice(index, 1);
      }
    } else {
      space.status = true;
      this.spaceFilters.push(space._id);
    };
    this.spaceSelected.emit(this.spaceFilters);
  }

  clearFilters(){
    this.spaceFilters = [];
    this.clearAll.emit();
    this.clearFilter = false;
  }

  addClicked() {
    this.router.navigate(['/spaces']);
  }


}
