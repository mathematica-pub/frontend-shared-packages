import { ClickDirective } from '../../events/click.directive';
import { ListenElement } from '../../events/event.directive';

export class ClickDirectiveStub extends ClickDirective {
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
