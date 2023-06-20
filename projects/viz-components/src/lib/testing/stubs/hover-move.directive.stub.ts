import { HoverMoveDirective } from '../../events/hover-move.directive';

export class HoverMoveDirectiveStub extends HoverMoveDirective {
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
