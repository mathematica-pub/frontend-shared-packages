import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { InputEventEffect } from '../events/effect';
import { InputEventDirective } from '../events/input-event';
import { StackedAreaComponent, STACKED_AREA } from './stacked-area.component';

@Directive({
  selector: '[vicLinesInputEffects]',
})
export class StackedAreaInputEventDirective extends InputEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicLinesInputEffects')
  effects: InputEventEffect<StackedAreaInputEventDirective>[];
  @Output() inputEventOutput = new EventEmitter<any>();

  constructor(@Inject(STACKED_AREA) public lines: StackedAreaComponent) {
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
