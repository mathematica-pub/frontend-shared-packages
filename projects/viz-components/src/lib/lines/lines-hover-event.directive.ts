import { Directive, Inject, Input } from '@angular/core';
import { HoverEventDirective } from '../events/hover-event';
import { LinesHoverEffect } from './lines-effect';
import { LINES, LinesComponent } from './lines.component';

@Directive({
  selector: '[vicLinesHoverEffects]',
})
export class LinesHoverEventDirective extends HoverEventDirective {
  @Input()
  vicLinesHoverEffects: LinesHoverEffect[];

  constructor(@Inject(LINES) public lines: LinesComponent) {
    super(lines);
  }

  chartPointerEnter(event: PointerEvent): void {
    this.vicLinesHoverEffects.forEach((effect) => effect.applyEffect(this));
  }

  chartPointerLeave(event: PointerEvent): void {
    this.vicLinesHoverEffects.forEach((effect) => effect.removeEffect(this));
  }
}
