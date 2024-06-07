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
import { BARS, BarsComponent } from './bars.component';

@Directive({
  selector: '[vicBarsInputEventEffects]',
})
export class BarsInputEventDirective<
  Datum,
  TOrdinalValue extends VicDataValue,
  TBarsComponent extends BarsComponent<Datum, TOrdinalValue> = BarsComponent<
    Datum,
    TOrdinalValue
  >
> extends InputEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicBarsInputEventEffects')
  effects: InputEventEffect<
    BarsInputEventDirective<Datum, TOrdinalValue, TBarsComponent>
  >[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input('vicBarsInputEvent$') override inputEvent$: Observable<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output('vicBarsInputEventOutput') eventOutput = new EventEmitter<any>();

  constructor(
    destroyRef: DestroyRef,
    @Inject(BARS) public bars: BarsComponent<Datum, TOrdinalValue>
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
