import { Directive } from '@angular/core';
import { fromEvent, map, Observable, switchMap, takeUntil } from 'rxjs';
import { ExampleDisplay } from './example-display';

@Directive()
export abstract class ResizableExampleDisplay extends ExampleDisplay {
  resizableWidth$: Observable<string>;

  initResizer(
    resizerEl: Element,
    resizableEl: HTMLElement,
    document: Document
  ): void {
    this.resizableWidth$ = this.getWidth(resizerEl, resizableEl, document);
  }

  getWidth(
    resizerEl: Element,
    resizableEl: HTMLElement,
    document: Document
  ): Observable<string> {
    const mousedown$ = fromEvent<MouseEvent>(resizerEl, 'mousedown');
    const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const mouseup$ = fromEvent<MouseEvent>(document, 'mouseup');

    return mousedown$.pipe(
      switchMap((startEvent) => {
        const startX = startEvent.clientX;
        const startWidth = resizableEl.offsetWidth;

        return mousemove$.pipe(
          map((moveEvent) => {
            const dx = moveEvent.clientX - startX;
            return `${startWidth + dx}px`;
          }),
          takeUntil(mouseup$)
        );
      })
    );
  }
}
