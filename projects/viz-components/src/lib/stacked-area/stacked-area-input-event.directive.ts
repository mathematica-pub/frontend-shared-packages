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
import { VicDataValue } from '../core/types/values';
import { InputEventEffect } from '../events/effect';
import { InputEventDirective } from '../events/input-event.directive';
import { STACKED_AREA, StackedAreaComponent } from './stacked-area.component';

@Directive({
  selector: '[vicStackedAreaInputEffects]',
})
export class StackedAreaInputEventDirective<
  Datum,
  TCategoricalValue extends VicDataValue,
  TStackedAreaComponent extends StackedAreaComponent<Datum, TCategoricalValue>
> extends InputEventDirective {
  @Input('vicStackedAreaInputEffects')
  effects: InputEventEffect<
    StackedAreaInputEventDirective<
      Datum,
      TCategoricalValue,
      TStackedAreaComponent
    >
  >[];
  @Input('vicStackedAreaInputEvent$') override inputEvent$: Observable<unknown>;
  @Output('vicStackedAreaInputEventOutput') eventOutput =
    new EventEmitter<any>();

  constructor(
    destroyRef: DestroyRef,
    @Inject(STACKED_AREA) public areas: TStackedAreaComponent
  ) {
    super(destroyRef);
  }

  handleNewEvent(inputEvent: any): void {
    if (inputEvent) {
      this.effects.forEach((effect) => effect.applyEffect(this, inputEvent));
    } else {
      this.effects.forEach((effect) => effect.removeEffect(this, inputEvent));
    }
  }
}
