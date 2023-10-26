import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterRolePage } from './register-role.page';

describe('RegisterRolePage', () => {
  let component: RegisterRolePage;
  let fixture: ComponentFixture<RegisterRolePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegisterRolePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
