import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyRulesModalPage } from './modify-rules-modal.page';

describe('ModifyRulesModalPage', () => {
  let component: ModifyRulesModalPage;
  let fixture: ComponentFixture<ModifyRulesModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModifyRulesModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
