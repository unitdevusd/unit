import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HostSpaceDetailPage } from './host-space-detail.page';

describe('HostSpaceDetailPage', () => {
  let component: HostSpaceDetailPage;
  let fixture: ComponentFixture<HostSpaceDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HostSpaceDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
