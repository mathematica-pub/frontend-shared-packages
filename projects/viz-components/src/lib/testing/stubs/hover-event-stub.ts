import { HoverEventDirective } from '../../events/hover-event';

export class HoverEventDirectiveStub extends HoverEventDirective {
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
