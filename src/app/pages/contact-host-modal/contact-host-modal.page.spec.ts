import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactHostModalPage } from './contact-host-modal.page';

describe('ContactHostModalPage', () => {
  let component: ContactHostModalPage;
  let fixture: ComponentFixture<ContactHostModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ContactHostModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
