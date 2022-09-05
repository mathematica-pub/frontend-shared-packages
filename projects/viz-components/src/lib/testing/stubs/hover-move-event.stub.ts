import { HoverAndMoveEventDirective } from '../../events/hover-move-event';

export class HoverAndMoveEventDirectiveStub extends HoverAndMoveEventDirective {
  setElements(): void {
    return;
  }
  elementPointerMove(event: PointerEvent): void {
    return;
  }
  elementPointerEnter(event: PointerEvent): void {
    return;
  }
  elementPointerLeave(event: PointerEvent): void {
    return;
  }
}
