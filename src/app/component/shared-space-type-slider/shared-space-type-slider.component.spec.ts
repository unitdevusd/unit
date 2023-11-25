import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SharedSpaceTypeSliderComponent } from './shared-space-type-slider.component';

describe('SharedSpaceTypeSliderComponent', () => {
  let component: SharedSpaceTypeSliderComponent;
  let fixture: ComponentFixture<SharedSpaceTypeSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedSpaceTypeSliderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SharedSpaceTypeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
