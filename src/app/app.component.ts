import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { InactivityService } from './services/inactivity.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private inactivityService: InactivityService) {}
}
