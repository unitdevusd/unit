import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSlotModalPage } from './time-slot-modal.page';

describe('TimeSlotModalPage', () => {
  let component: TimeSlotModalPage;
  let fixture: ComponentFixture<TimeSlotModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TimeSlotModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
