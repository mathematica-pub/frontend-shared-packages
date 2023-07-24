/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { select } from 'd3';
import { filter, takeUntil } from 'rxjs';
import { EventEffect } from '../events/effect';
import { HoverDirective } from '../events/hover.directive';
import {
  BarsEventOutput,
  BarsTooltipOutput,
  getBarsTooltipData,
} from './bars-tooltip-data';
import { BARS, BarsComponent } from './bars.component';

interface BarsHoverExtras {
  barBounds: [[number, number], [number, number]];
}

export type BarsHoverOutput = BarsEventOutput & BarsHoverExtras;

@Directive({
  selector: '[vicBarsHoverEffects]',
})
export class BarsHoverDirective extends HoverDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicBarsHoverEffects') effects: EventEffect<BarsHoverDirective>[];
  @Output('vicBarsHoverOutput') eventOutput =
    new EventEmitter<BarsHoverOutput>();
  barIndex: number;
  elRef: ElementRef;

  constructor(@Inject(BARS) public bars: BarsComponent) {
    super();
  }

  setListenedElements(): void {
    this.bars.bars$
      .pipe(
        takeUntil(this.unsubscribe),
        filter((barSels) => !!barSels)
      )
      .subscribe((barSels) => {
        this.elements = barSels.nodes();
        this.setListeners();
      });
  }

  onElementPointerEnter(event: PointerEvent): void {
    this.barIndex = select(event.target as SVGRectElement).datum() as number;
    this.elRef = new ElementRef(event.target);
    if (this.effects) {
      this.effects.forEach((effect) => effect.applyEffect(this));
    }
  }

  onElementPointerLeave(): void {
    if (this.effects) {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
  }

  getTooltipData(): BarsTooltipOutput {
    const tooltipData = getBarsTooltipData(
      this.barIndex,
      this.elRef,
      this.bars
    );
    return tooltipData;
  }
}
