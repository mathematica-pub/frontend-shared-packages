import { Directive, Inject, Input } from '@angular/core';
import { HoverEventDirective } from '../chart-svg-events/hover-event';
import { LinesHoverEffect } from './lines-effect';
import { LINES, LinesComponent } from './lines.component';

@Directive({
  selector: '[vicLinesHoverEffects]',
})
export class LinesHoverEventDirective extends HoverEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicLinesHoverEffects') effects: LinesHoverEffect[];

  constructor(@Inject(LINES) public lines: LinesComponent) {
    super(lines);
  }

  chartPointerEnter(event: PointerEvent): void {
    this.effects.forEach((effect) => effect.applyEffect(this));
  }

  chartPointerLeave(event: PointerEvent): void {
    this.effects.forEach((effect) => effect.removeEffect(this));
  }
}
