import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CashoutPage } from './cashout.page';

describe('CashoutPage', () => {
  let component: CashoutPage;
  let fixture: ComponentFixture<CashoutPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CashoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
