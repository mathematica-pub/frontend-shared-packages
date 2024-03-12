/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { InputEventEffect } from '../events/effect';
import { InputEventDirective } from '../events/input-event.directive';
import { STACKED_AREA, StackedAreaComponent } from './stacked-area.component';

@Directive({
  selector: '[vicLinesInputEffects]',
})
export class StackedAreaInputEventDirective<
  Datum,
  ExtendedStackedAreaComponent extends StackedAreaComponent<Datum>
> extends InputEventDirective {
  @Input('vicStackedAreaInputEffects')
  effects: InputEventEffect<
    StackedAreaInputEventDirective<Datum, ExtendedStackedAreaComponent>
  >[];
  @Output('vicStackedAreaInputEventOutput') eventOutput =
    new EventEmitter<any>();

  constructor(
    @Inject(STACKED_AREA) public lines: ExtendedStackedAreaComponent
  ) {
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
