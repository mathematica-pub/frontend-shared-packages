import { DestroyRef, Injectable, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdkActiveHeadingTracker {
  private activeHeadingId = new BehaviorSubject<string | null>(null);
  activeHeadingId$ = this.activeHeadingId.asObservable();

  constructor(private ngZone: NgZone) {}

  initScrollListener(contentEl: HTMLElement, destroyRef: DestroyRef): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'scroll')
        .pipe(
          takeUntilDestroyed(destroyRef),
          debounceTime(50),
          distinctUntilChanged()
        )
        .subscribe(() => {
          const headings = Array.from(
            contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6')
          ) as HTMLHeadingElement[];
          const activeHeading = this.findActiveHeading(headings);
          this.ngZone.run(() => {
            if (activeHeading) {
              this.activeHeadingId.next(activeHeading.id);
            }
          });
        });
    });
  }

  private findActiveHeading(
    headings: HTMLHeadingElement[]
  ): HTMLHeadingElement | null {
    const scrollPosition = window.scrollY;
    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i];
      if (heading.offsetTop <= scrollPosition + 50) {
        return heading;
      }
    }
    return headings[0] || null;
  }

  setActiveHeading(heading: HTMLHeadingElement): void {
    this.activeHeadingId.next(heading.id);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
