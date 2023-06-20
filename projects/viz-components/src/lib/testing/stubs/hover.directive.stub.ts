import { HoverDirective } from '../../events/hover.directive';

export class HoverDirectiveStub extends HoverDirective {
  onElementPointerEnter(event: PointerEvent): void {
    return;
  }
  onElementPointerLeave(event: PointerEvent): void {
    return;
  }
  setListenedElements(): void {
    return;
  }
}
