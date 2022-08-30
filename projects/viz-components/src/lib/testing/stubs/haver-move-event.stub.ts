import { HoverAndMoveEventDirective } from '../../events/hover-move-event';

export class HoverAndMoveEventDirectiveStub extends HoverAndMoveEventDirective {
  chartPointerMove(event: PointerEvent): void {
    return;
  }
  chartPointerEnter(event: PointerEvent): void {
    return;
  }
  chartPointerLeave(event: PointerEvent): void {
    return;
  }
}
