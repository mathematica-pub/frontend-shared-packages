import { HoverAndMoveEventDirective } from '../../events/hover-move-event';

export class HoverAndMoveEventDirectiveStub extends HoverAndMoveEventDirective {
  setListenedElements(): void {
    return;
  }
  onElementPointerMove(event: PointerEvent): void {
    return;
  }
  onElementPointerEnter(event: PointerEvent): void {
    return;
  }
  onElementPointerLeave(event: PointerEvent): void {
    return;
  }
}
