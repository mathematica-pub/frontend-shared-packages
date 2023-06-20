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
import { HoverMoveDirective } from '../events/hover-move.directive';
import { BarsEventOutput, getBarsTooltipData } from './bars-tooltip-data';
import { BARS, BarsComponent } from './bars.component';

interface BarsHoverMoveExtras {
  positionX: number;
  positionY: number;
}

export type BarsHoverMoveOutput = BarsEventOutput & BarsHoverMoveExtras;

@Directive({
  selector: '[vicBarsHoverMoveEffects]',
})
export class BarsHoverMoveDirective extends HoverMoveDirective {
  @Input('vicBarsHoverMoveEffects')
  effects: EventEffect<BarsHoverMoveDirective>[];
  @Output('vicBarsHoverMoveOutput') eventOutput =
    new EventEmitter<BarsHoverMoveOutput>();
  barIndex: number;
  elRef: ElementRef;
  pointerX: number;
  pointerY: number;

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
    this.barIndex = this.getBarIndex(event);
    this.elRef = new ElementRef(event.target);
  }

  getBarIndex(event: PointerEvent): number {
    return select(event.target as SVGRectElement).datum() as number;
  }

  onElementPointerMove(event: PointerEvent) {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    if (this.effects) {
      this.effects.forEach((effect) => effect.applyEffect(this));
    }
  }

  onElementPointerLeave() {
    if (this.effects) {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
    this.barIndex = undefined;
    this.elRef = undefined;
  }

  getTooltipData(): BarsHoverMoveOutput {
    const tooltipData = getBarsTooltipData(
      this.barIndex,
      this.elRef,
      this.bars
    );
    const extras = {
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
    return { ...tooltipData, ...extras };
  }
}
