import { AfterViewInit, Directive, OnDestroy } from '@angular/core';
import { ChartSvgEvent } from './chart-svg-event';

@Directive()
export abstract class HoverEvent
  extends ChartSvgEvent
  implements AfterViewInit, OnDestroy
{
  unlistenPointerEnter: () => void;
  unlistenPointerMove: () => void;
  unlistenPointerLeave: () => void;
  unlistenTouchStart: () => void;

  abstract chartPointerEnter(event: PointerEvent): void;
  abstract chartPointerMove(event: PointerEvent): void;
  abstract chartPointerLeave(event: PointerEvent): void;

  ngOnDestroy(): void {
    this.unlistenTouchStart();
    this.unlistenPointerEnter();
  }

  setListeners(): void {
    this.setTouchStartListener(this.el);
    this.setPointerEnterListener(this.el);
  }

  private setTouchStartListener(el: Element) {
    this.unlistenTouchStart = this.renderer.listen(
      el,
      'touchstart',
      (event) => {
        this.onTouchStart(event);
      }
    );
  }

  private onTouchStart(event: TouchEvent): void {
    event.preventDefault();
  }

  private setPointerEnterListener(el: Element) {
    console.log('setPointerEnter');
    this.unlistenPointerEnter = this.renderer.listen(
      el,
      'pointerenter',
      (event) => {
        this.onPointerEnter(event, el);
      }
    );
  }

  private onPointerEnter(event: PointerEvent, el: Element): void {
    this.chartPointerEnter(event);
    this.setPointerMoveListener(el);
    this.setPointerLeaveListener(el);
  }

  private setPointerMoveListener(el) {
    this.unlistenPointerMove = this.renderer.listen(
      el,
      'pointermove',
      (event) => {
        this.chartPointerMove(event);
      }
    );
  }

  private setPointerLeaveListener(el: Element) {
    this.unlistenPointerLeave = this.renderer.listen(
      el,
      'pointerleave',
      (event) => {
        this.chartPointerLeave(event);
        this.unlistenPointerMove();
        this.unlistenPointerLeave();
      }
    );
  }
}
