import { AfterViewInit, Directive, OnDestroy } from '@angular/core';
import { ChartSvgEvent } from './chart-svg-event';

@Directive()
export abstract class HoverEvent
  extends ChartSvgEvent
  implements AfterViewInit, OnDestroy
{
  unlistenPointerEnter: () => void;
  unlistenPointerLeave: () => void;
  unlistenTouchStart: () => void;

  abstract chartPointerEnter(event: PointerEvent): void;
  abstract chartPointerLeave(event: PointerEvent): void;

  ngOnDestroy(): void {
    this.unlistenTouchStart();
    this.unlistenPointerEnter();
  }

  setListeners(): void {
    this.setTouchStartListener(this.el);
    this.setPointerEnterListener(this.el);
  }

  setTouchStartListener(el: Element) {
    this.unlistenTouchStart = this.renderer.listen(
      el,
      'touchstart',
      (event) => {
        this.onTouchStart(event);
      }
    );
  }

  onTouchStart(event: TouchEvent): void {
    event.preventDefault();
  }

  setPointerEnterListener(el: Element) {
    this.unlistenPointerEnter = this.renderer.listen(
      el,
      'pointerenter',
      (event) => {
        this.onPointerEnter(event, el);
      }
    );
  }

  onPointerEnter(event: PointerEvent, el: Element): void {
    this.chartPointerEnter(event);
    this.setPointerLeaveListener(el);
  }

  setPointerLeaveListener(el: Element) {
    this.unlistenPointerLeave = this.renderer.listen(
      el,
      'pointerleave',
      (event) => {
        this.chartPointerLeave(event);
        this.unlistenPointerLeave();
      }
    );
  }
}
