import { ClickEventDirective } from '../../events/click-event';
import { ListenElement } from '../../events/event';

export class ClickEventDirectiveStub extends ClickEventDirective {
  onElementClick(event: PointerEvent, el: ListenElement): void {
    return;
  }
  onClickRemove(): void {
    return;
  }
  setListenedElements(): void {
    return;
  }
}
