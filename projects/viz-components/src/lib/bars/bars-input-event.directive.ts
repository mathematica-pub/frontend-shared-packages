/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { InputEventEffect } from '../events/effect';
import { InputEventDirective } from '../events/input-event';
import { BARS, BarsComponent } from './bars.component';

@Directive({
  selector: '[vicBarsInputEffects]',
})
export class BarsInputEventDirective extends InputEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicBarsInputEffects')
  effects: InputEventEffect<BarsInputEventDirective>[];
  @Input('vicBarsInputEvent$') override inputEvent$: Observable<any>;
  @Output('vicBarsInputEventOutput') eventOutput = new EventEmitter<any>();

  constructor(@Inject(BARS) public bars: BarsComponent) {
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
