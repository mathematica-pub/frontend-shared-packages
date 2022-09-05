import { AfterViewInit, Directive, OnDestroy } from '@angular/core';
import { EventDirective, UnlistenFunction } from './event';

@Directive()
export abstract class HoverEventDirective
  extends EventDirective
  implements AfterViewInit, OnDestroy
{
  unlistenTouchStart: UnlistenFunction[];
  unlistenPointerEnter: UnlistenFunction[];
  unlistenPointerLeave: UnlistenFunction;

  abstract elementPointerEnter(event: PointerEvent): void;
  abstract elementPointerLeave(event: PointerEvent): void;

  ngOnDestroy(): void {
    this.unlistenTouchStart.forEach((func) => func());
    this.unlistenPointerEnter.forEach((func) => func());
  }

  setListeners(): void {
    this.setTouchStartListener();
    this.setPointerEnterListener();
  }

  setTouchStartListener() {
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
    this.unlistenPointerEnter = this.elements.map((el) =>
      this.renderer.listen(el, 'pointerenter', (event) => {
        this.onPointerEnter(event, el);
      })
    );
  }

  onPointerEnter(event: PointerEvent, el: Element): void {
    this.elementPointerEnter(event);
    this.setPointerLeaveListener(el);
  }

  setPointerLeaveListener(el: Element) {
    this.unlistenPointerLeave = this.renderer.listen(
      el,
      'pointerleave',
      (event) => {
        this.elementPointerLeave(event);
        this.unlistenPointerLeave();
      }
    );
  }
}
