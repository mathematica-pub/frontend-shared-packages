import { Directive, Inject, Input } from '@angular/core';
import { select } from 'd3';
import { EventEffect } from '../events/effect';
import { HoverEventDirective } from '../events/hover-event';
import { BARS, BarsComponent } from './bars.component';

export class BarsHoverEmittedOutput {
  datum: any;
  color: string;
  x: string;
  y: string;
  category: string;
  positionX?: number;
  positionY?: number;
}

@Directive({
  selector: '[vicLinesHoverEffects]',
})
export class BarsHoverEventDirective extends HoverEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicBarsHoverEffects')
  effects: EventEffect<BarsHoverEventDirective>[];

  constructor(@Inject(BARS) public bars: BarsComponent) {
    super();
  }

  setElements(): void {
    this.elements = [this.bars.chart.svgRef.nativeElement];
  }

  elementPointerEnter(event: PointerEvent): void {
    const d = select(event.target as SVGRectElement).datum();
    console.log(d);
    this.effects.forEach((effect) => effect.applyEffect(this));
  }

  elementPointerLeave(): void {
    this.effects.forEach((effect) => effect.removeEffect(this));
  }
}
