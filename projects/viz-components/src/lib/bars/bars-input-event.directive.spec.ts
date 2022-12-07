import { Directive, Inject, Input } from '@angular/core';
import { EventEffect } from '../events/effect';
import { HoverEventDirective } from '../events/hover-event';
import { BARS, BarsComponent } from './bars.component';

@Directive({
  selector: '[vicBarsHoverEffects]',
})
export class BarsHoverEventDirective extends HoverEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicLinesHoverEffects')
  effects: EventEffect<BarsHoverEventDirective>[];

  constructor(@Inject(BARS) public bars: BarsComponent) {
    super();
  }

  setElements(): void {
    this.elements = [this.bars.chart.svgRef.nativeElement];
  }

  elementPointerEnter(): void {
    this.effects.forEach((effect) => effect.applyEffect(this));
  }

  elementPointerLeave(): void {
    this.effects.forEach((effect) => effect.removeEffect(this));
  }
}
