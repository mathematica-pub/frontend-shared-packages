import { fromEvent, map, Observable, switchMap, takeUntil } from 'rxjs';
import {
  AbstractConstructor,
  Constructor,
} from '../../core/common-behaviors/constructor';

export function resizerMixinAbstract<T extends AbstractConstructor>(Base: T) {
  abstract class Mixin extends Base {
    resizableWidth$: Observable<string>;

    initResizer(
      resizerEl: Element,
      resizableEl: HTMLElement,
      document: Document
    ): void {
      this.resizableWidth$ = getWidth(resizerEl, resizableEl, document);
    }
  }
  return Mixin;
}

export function resizerMixin<T extends Constructor>(Base: T) {
  return class extends Base {
    resizableWidth$: Observable<string>;

    initResizer(
      resizerEl: Element,
      resizableEl: HTMLElement,
      document: Document
    ): void {
      this.resizableWidth$ = getWidth(resizerEl, resizableEl, document);
    }
  };
}

function getWidth(
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
