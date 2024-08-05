/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import {
  DestroyRef,
  Directive,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';
import { InputEventAction } from '../../events/action';
import { InputEventDirective } from '../../events/input-event.directive';
import { LINES, LinesComponent } from '../lines.component';

@Directive({
  selector: '[vicLinesInputActions]',
})
export class LinesInputEventDirective<
  Datum,
  ExtendedLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> extends InputEventDirective {
  @Input('vicLinesInputActions')
  actions: InputEventAction<
    LinesInputEventDirective<Datum, ExtendedLinesComponent>
  >[];
  @Input('vicLinesInputEvent$') override inputEvent$: Observable<unknown>;
  @Output('vicLinesInputEventOutput') inputEventOutput =
    new EventEmitter<unknown>();

  constructor(
    destroyRef: DestroyRef,
    @Inject(LINES) public lines: ExtendedLinesComponent
  ) {
    super(destroyRef);
  }

  handleNewEvent(inputEvent: unknown): void {
    if (inputEvent) {
      this.actions.forEach((action) => action.onStart(this, inputEvent));
    } else {
      this.actions.forEach((action) => action.onEnd(this, inputEvent));
    }
  }
}
