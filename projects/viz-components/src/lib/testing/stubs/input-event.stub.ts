import { InputEventDirective } from '../../events/input-event';

export class InputEventDirectiveStub extends InputEventDirective {
  handleNewEvent(event: any): void {
    return;
  }
}
