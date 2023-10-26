import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-role',
  templateUrl: './register-role.page.html',
  styleUrls: ['./register-role.page.scss'],
})
export class RegisterRolePage implements OnInit {

  roles : any = [
    {text : "Rent a Unit", image : '.../../../../assets/imgs/tanent.png', role : 'renter'},
    {text : "Host your Unit", image : '.../../../../assets/imgs/owner.png', role : 'host'}
  ];
  constructor(private router: Router) { }

  ngOnInit() {
  }
  
  type(role: string) {
    this.router.navigateByUrl(`/register/${role}`, { replaceUrl: true });
  }
}
