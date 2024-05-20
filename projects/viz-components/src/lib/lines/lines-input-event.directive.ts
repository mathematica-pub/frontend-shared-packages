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
import { InputEventEffect } from '../events/effect';
import { InputEventDirective } from '../events/input-event.directive';
import { LINES, LinesComponent } from './lines.component';

@Directive({
  selector: '[vicLinesInputEffects]',
})
export class LinesInputEventDirective<
  Datum,
  ExtendedLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>
> extends InputEventDirective {
  @Input('vicLinesInputEffects')
  effects: InputEventEffect<
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
      this.effects.forEach((effect) => effect.applyEffect(this, inputEvent));
    } else {
      this.effects.forEach((effect) => effect.removeEffect(this, inputEvent));
    }
  }
}
