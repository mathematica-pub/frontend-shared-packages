import { Directive } from '@angular/core';
import { HoverEvent } from './hover-event';

@Directive()
export abstract class HoverAndMoveEvent extends HoverEvent {
  unlistenPointerMove: () => void;

  abstract chartPointerMove(event: PointerEvent): void;

  override onPointerEnter(event: PointerEvent, el: Element): void {
    this.chartPointerEnter(event);
    this.setPointerMoveListener(el);
    this.setPointerLeaveListener(el);
  }

  setPointerMoveListener(el) {
    this.unlistenPointerMove = this.renderer.listen(
      el,
      'pointermove',
      (event) => {
        this.chartPointerMove(event);
      }
    );
  }

  override setPointerLeaveListener(el: Element) {
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
