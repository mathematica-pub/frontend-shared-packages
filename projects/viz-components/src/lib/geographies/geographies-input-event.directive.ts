import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { InputEventEffect } from '../events/effect';
import { InputEventDirective } from '../events/input-event.directive';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

@Directive({
  selector: '[vicGeographiesInputEffects]',
})
export class GeographiesInputEventDirective<
  T,
  U extends GeographiesComponent<T> = GeographiesComponent<T>
> extends InputEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicGeographiesInputEventEffects')
  effects: InputEventEffect<GeographiesInputEventDirective<T, U>>[];
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicGeographiesInputEvent$') override inputEvent$: Observable<unknown>;
  @Output() inputEventOutput = new EventEmitter<unknown>();

  constructor(@Inject(GEOGRAPHIES) public geographies: U) {
    super();
  }

  handleNewEvent(inputEvent: unknown): void {
    if (inputEvent) {
      this.effects.forEach((effect) => effect.applyEffect(this, inputEvent));
    } else {
      this.effects.forEach((effect) => effect.removeEffect(this, inputEvent));
    }
  }
}
