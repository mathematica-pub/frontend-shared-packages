import { ClickEventDirective } from '../../events/click-event';

export class ClickEventDirectiveStub extends ClickEventDirective {
  setElements(): void {
    return;
  }
  chartClick(event: Event): void {
    return;
  }
}
