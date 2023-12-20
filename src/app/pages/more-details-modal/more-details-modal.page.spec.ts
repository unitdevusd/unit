import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoreDetailsModalPage } from './more-details-modal.page';

describe('MoreDetailsModalPage', () => {
  let component: MoreDetailsModalPage;
  let fixture: ComponentFixture<MoreDetailsModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MoreDetailsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
