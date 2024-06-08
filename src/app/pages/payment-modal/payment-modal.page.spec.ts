import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentModalPage } from './payment-modal.page';

describe('PaymentModalPage', () => {
  let component: PaymentModalPage;
  let fixture: ComponentFixture<PaymentModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaymentModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
