import { ClickEventDirective } from '../../chart-svg-events/click-event';

export class ClickEventDirectiveStub extends ClickEventDirective {
  chartClick(event: Event): void {
    return;
  }
}
