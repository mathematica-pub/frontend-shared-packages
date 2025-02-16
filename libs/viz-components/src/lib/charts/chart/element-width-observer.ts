import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ElementWidthObserver {
  observe(element: HTMLElement): Observable<number> {
    return new Observable((subscriber) => {
      const observer = new ResizeObserver((entries) => {
        subscriber.next(entries[0].contentRect.width);
      });
      observer.observe(element);
      return () => {
        observer.unobserve(element);
        observer.disconnect();
      };
    });
  }
}
