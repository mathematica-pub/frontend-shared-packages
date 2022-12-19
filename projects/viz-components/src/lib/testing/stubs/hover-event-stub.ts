import { HoverEventDirective } from '../../events/hover-event';

export class HoverEventDirectiveStub extends HoverEventDirective {
  elementPointerEnter(event: PointerEvent): void {
    return;
  }
  elementPointerLeave(event: PointerEvent): void {
    return;
  }
  setListenedElements(): void {
    return;
  }
}
