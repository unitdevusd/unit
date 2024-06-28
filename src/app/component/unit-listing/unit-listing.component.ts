import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-unit-listing',
  templateUrl: './unit-listing.component.html',
  styleUrls: ['./unit-listing.component.scss'],
})
export class UnitListingComponent implements OnInit {
  @Input() units: any;
  @Output() unitClicked = new EventEmitter();
  @Output() loadMoreUnits = new EventEmitter();
  floorTypeUrl: any;


  constructor() { }

  ngOnInit() {}

  place(placeInfo: any){
    this.unitClicked.emit(placeInfo);
  }

  loadMore(event: any) {
    this.loadMoreUnits.emit(event);
  }

}
