import { HoverAndMoveEventDirective } from '../../events/hover-move-event';

export class HoverAndMoveEventDirectiveStub extends HoverAndMoveEventDirective {
  setListenedElements(): void {
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
