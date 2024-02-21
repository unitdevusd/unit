import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyLocationPage } from './modify-location.page';

describe('ModifyLocationPage', () => {
  let component: ModifyLocationPage;
  let fixture: ComponentFixture<ModifyLocationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModifyLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
