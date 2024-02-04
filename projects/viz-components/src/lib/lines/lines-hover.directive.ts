import { Directive, Inject, Input } from '@angular/core';
import { EventEffect } from '../events/effect';
import { HoverDirective } from '../events/hover.directive';
import { LINES, LinesComponent } from './lines.component';

@Directive({
  selector: '[vicLinesHoverEffects]',
})
export class LinesHoverDirective<
  T,
  U extends LinesComponent<T> = LinesComponent<T>
> extends HoverDirective {
  @Input('vicLinesHoverEffects')
  effects: EventEffect<LinesHoverDirective<T>>[];

  constructor(@Inject(LINES) public lines: U) {
    super();
  }

  setListenedElements(): void {
    this.elements = [this.lines.chart.svgRef.nativeElement];
    this.setListeners();
  }

  onElementPointerEnter(): void {
    this.effects.forEach((effect) => effect.applyEffect(this));
  }

  onElementPointerLeave(): void {
    this.effects.forEach((effect) => effect.removeEffect(this));
  }
}
