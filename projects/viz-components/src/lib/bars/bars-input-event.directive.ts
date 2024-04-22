/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { VicDataValue } from '../../public-api';
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
  @Input('vicBarsInputEvent$') override inputEvent$: Observable<any>;
  @Output('vicBarsInputEventOutput') eventOutput = new EventEmitter<any>();

  constructor(@Inject(BARS) public bars: BarsComponent<Datum, TOrdinalValue>) {
    super();
  }

  handleNewEvent(inputEvent: any): void {
    if (inputEvent) {
      this.effects.forEach((effect) => effect.applyEffect(this, inputEvent));
    } else {
      this.effects.forEach((effect) => effect.removeEffect(this, inputEvent));
    }
  }
}
