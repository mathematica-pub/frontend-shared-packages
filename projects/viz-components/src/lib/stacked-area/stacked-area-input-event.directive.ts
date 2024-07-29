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
import { STACKED_AREA, StackedAreaComponent } from './stacked-area.component';

@Directive({
  selector: '[vicStackedAreaInputEffects]',
})
export class StackedAreaInputEventDirective<
  Datum,
  ExtendedStackedAreaComponent extends StackedAreaComponent<Datum>,
> extends InputEventDirective {
  @Input('vicStackedAreaInputEffects')
  effects: InputEventEffect<
    StackedAreaInputEventDirective<Datum, ExtendedStackedAreaComponent>
  >[];
  @Input('vicStackedAreaInputEvent$') override inputEvent$: Observable<unknown>;
  @Output('vicStackedAreaInputEventOutput') eventOutput =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new EventEmitter<any>();

  constructor(
    destroyRef: DestroyRef,
    @Inject(STACKED_AREA) public areas: ExtendedStackedAreaComponent
  ) {
    super(destroyRef);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleNewEvent(inputEvent: any): void {
    if (inputEvent) {
      this.effects.forEach((effect) => effect.applyEffect(this, inputEvent));
    } else {
      this.effects.forEach((effect) => effect.removeEffect(this, inputEvent));
    }
  }
}
