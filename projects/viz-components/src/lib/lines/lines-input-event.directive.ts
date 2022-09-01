import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { InputEventDirective } from '../events/input-event';
import { LinesInputEffect } from './lines-effect';
import { LINES, LinesComponent } from './lines.component';

@Directive({
  selector: '[vicLinesInputEffects]',
})
export class LinesInputEventDirective extends InputEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicLinesInputEffects') effects: LinesInputEffect[];
  @Output() inputEventOutput = new EventEmitter<any>();

  constructor(@Inject(LINES) public lines: LinesComponent) {
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
