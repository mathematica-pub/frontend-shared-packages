import { HoverEventDirective } from '../../events/hover-event';

export class HoverEventDirectiveStub extends HoverEventDirective {
  chartPointerEnter(event: PointerEvent): void {
    return;
  }
  chartPointerLeave(event: PointerEvent): void {
    return;
  }
}
