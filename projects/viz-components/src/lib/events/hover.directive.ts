import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { EventDirective, UnlistenFunction } from './event.directive';

@Directive()
export abstract class HoverDirective
  extends EventDirective
  implements OnDestroy
{
  unsubscribe: Subject<void> = new Subject();
  unlistenTouchStart: UnlistenFunction[];
  unlistenPointerEnter: UnlistenFunction[];
  unlistenPointerLeave: UnlistenFunction;

  abstract onElementPointerEnter(event: PointerEvent): void;
  abstract onElementPointerLeave(event: PointerEvent): void;

  ngOnDestroy(): void {
    this.unlistenTouchStart.forEach((func) => func());
    this.unlistenPointerEnter.forEach((func) => func());
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  setListeners(): void {
    this.setTouchStartListener();
    this.setPointerEnterListener();
  }

  setTouchStartListener() {
    if (this.unlistenTouchStart) {
      this.unlistenTouchStart.forEach((func) => func());
    }

    this.unlistenTouchStart = this.elements.map((el) =>
      this.renderer.listen(el, 'touchstart', (event) => {
        this.onTouchStart(event);
      })
    );
  }

  onTouchStart(event: TouchEvent): void {
    event.preventDefault();
  }

  setPointerEnterListener() {
    if (this.unlistenPointerEnter) {
      this.unlistenPointerEnter.forEach((func) => func());
    }

    this.unlistenPointerEnter = this.elements.map((el) =>
      this.renderer.listen(el, 'pointerenter', (event) => {
        this.onPointerEnter(event, el);
      })
    );
  }

  onPointerEnter(event: PointerEvent, el: Element): void {
    this.onElementPointerEnter(event);
    this.setPointerLeaveListener(el);
  }

  setPointerLeaveListener(el: Element) {
    if (this.unlistenPointerLeave) this.unlistenPointerLeave();
    this.unlistenPointerLeave = this.renderer.listen(
      el,
      'pointerleave',
      (event) => {
        this.onElementPointerLeave(event);
        this.unlistenPointerLeave();
      }
    );
  }
}
