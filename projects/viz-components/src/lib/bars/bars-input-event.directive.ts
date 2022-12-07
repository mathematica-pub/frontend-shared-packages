import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { InputEventEffect } from '../events/effect';
import { InputEventDirective } from '../events/input-event';
import { LinesInputEventDirective } from '../lines/lines-input-event.directive';
import { LinesComponent } from '../lines/lines.component';
import { BARS } from './bars.component';

@Directive({
  selector: '[vicBarsInputEffects]',
})
export class BarsInputEventDirective extends InputEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicBarsInputEffects')
  effects: InputEventEffect<LinesInputEventDirective>[];
  @Output() inputEventOutput = new EventEmitter<any>();

  constructor(@Inject(BARS) public lines: LinesComponent) {
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
