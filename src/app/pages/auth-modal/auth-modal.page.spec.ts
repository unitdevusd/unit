import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthModalPage } from './auth-modal.page';

describe('AuthModalPage', () => {
  let component: AuthModalPage;
  let fixture: ComponentFixture<AuthModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AuthModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
