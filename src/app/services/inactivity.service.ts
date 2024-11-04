import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {

  private inactivityTimeout: number = 1 * 60 * 1000; // 10 minutes
  private timeoutSubject = new Subject<void>();
  private timer$ = timer(this.inactivityTimeout);

  constructor(private router: Router, private ngZone: NgZone) {
    this.startInactivityMonitor();
  }

  private startInactivityMonitor() {
    this.ngZone.runOutsideAngular(() => {
      const resetTimeout = () => {
        this.timeoutSubject.next();
      };

      window.addEventListener('mousemove', resetTimeout);
      window.addEventListener('keydown', resetTimeout);
      window.addEventListener('scroll', resetTimeout);

      this.timer$.pipe(
        takeUntil(this.timeoutSubject)
      ).subscribe(() => {
        this.router.navigate(['/login']);
      });
    });
  }
}
