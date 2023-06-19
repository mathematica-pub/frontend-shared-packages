import { Directive } from '@angular/core';
import { pointer } from 'd3';
import { UnlistenFunction } from './event';
import { HoverEventDirective } from './hover-event';

@Directive()
export abstract class HoverAndMoveEventDirective extends HoverEventDirective {
  unlistenPointerMove: UnlistenFunction;

  abstract onElementPointerMove(event: PointerEvent): void;

  override onPointerEnter(event: PointerEvent, el: Element): void {
    this.onElementPointerEnter(event);
    this.setPointerMoveListener(el);
    this.setPointerLeaveListener(el);
  }

  setPointerMoveListener(el) {
    this.unlistenPointerMove = this.renderer.listen(
      el,
      'pointermove',
      (event) => {
        this.onElementPointerMove(event);
      }
    );
  }

  override setPointerLeaveListener(el: Element) {
    this.unlistenPointerLeave = this.renderer.listen(
      el,
      'pointerleave',
      (event) => {
        this.onElementPointerLeave(event);
        this.unlistenPointerMove();
        this.unlistenPointerLeave();
      }
    );
  }

  getPointerValuesArray(event: PointerEvent): [number, number] {
    return pointer(event);
  }
}
