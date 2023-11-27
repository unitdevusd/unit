import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-unit-listing',
  templateUrl: './unit-listing.component.html',
  styleUrls: ['./unit-listing.component.scss'],
})
export class UnitListingComponent implements OnInit {
  // slideOpts = { slidesPerView: 'auto', zoom: false, grabCursor: true };
  @Input() units: any;
  @Output() unitClicked = new EventEmitter();


  constructor() { }

  ngOnInit() {}

  place(placeInfo: any){
    this.unitClicked.emit(placeInfo);
  }

}
