import { HoverEventDirective } from '../../chart-svg-events/hover-event';

export class HoverEventDirectiveStub extends HoverEventDirective {
  chartPointerEnter(event: PointerEvent): void {
    return;
  }
  chartPointerLeave(event: PointerEvent): void {
    return;
  }
}
