import { InputEventDirective } from '../../events/input-event.directive';

export class InputEventDirectiveStub extends InputEventDirective {
  handleNewEvent(event: any): void {
    return;
  }
}
