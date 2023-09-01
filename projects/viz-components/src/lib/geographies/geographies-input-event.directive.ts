/* eslint-disable @angular-eslint/no-input-rename */
// eslint-disable @angular-eslint/no-input-rename
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { InputEventEffect } from '../events/effect';
import { InputEventDirective } from '../events/input-event.directive';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

@Directive({
  selector: '[vicGeographiesInputEffects]',
})
export class GeographiesInputEventDirective<
  T extends GeographiesComponent = GeographiesComponent
> extends InputEventDirective {
  @Input('vicGeographiesInputEventEffects')
  effects: InputEventEffect<GeographiesInputEventDirective<T>>[];
  @Input('vicGeographiesInputEvent$') override inputEvent$: Observable<any>;
  @Output() inputEventOutput = new EventEmitter<any>();

  constructor(@Inject(GEOGRAPHIES) public geographies: GeographiesComponent) {
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
