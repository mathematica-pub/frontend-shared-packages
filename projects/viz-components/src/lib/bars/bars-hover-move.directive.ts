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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { filter } from 'rxjs';
import { HoverMoveEventEffect } from '../events/effect';
import { HoverMoveDirective } from '../events/hover-move.directive';
import { VicBarsEventOutput, getBarsTooltipData } from './bars-tooltip-data';
import { BARS, BarsComponent } from './bars.component';

@Directive({
  selector: '[vicBarsHoverMoveEffects]',
})
export class BarsHoverMoveDirective<
  T,
  U extends BarsComponent<T> = BarsComponent<T>
> extends HoverMoveDirective {
  @Input('vicBarsHoverMoveEffects')
  effects: HoverMoveEventEffect<BarsHoverMoveDirective<T, U>>[];
  @Output('vicBarsHoverMoveOutput') eventOutput = new EventEmitter<
    VicBarsEventOutput<T>
  >();
  barIndex: number;
  elRef: ElementRef;
  pointerX: number;
  pointerY: number;

  constructor(@Inject(BARS) public bars: U) {
    super();
  }

  setListenedElements(): void {
    this.bars.bars$
      .pipe(
        takeUntilDestroyed(),
        filter((barSels) => !!barSels)
      )
      .subscribe((barSels) => {
        this.elements = barSels.nodes();
        this.setListeners();
      });
  }

  onElementPointerEnter(event: PointerEvent): void {
    if (!this.preventEffect) {
      this.barIndex = this.getBarIndex(event);
      this.elRef = new ElementRef(event.target);
    }
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => {
        if (effect.initializeEffect) {
          effect.initializeEffect(this);
        }
      });
    }
  }

  getBarIndex(event: PointerEvent): number {
    return select(event.target as SVGRectElement).datum() as number;
  }

  onElementPointerMove(event: PointerEvent) {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => effect.applyEffect(this));
    }
  }

  onElementPointerLeave() {
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
    this.barIndex = undefined;
    this.elRef = undefined;
  }

  getEventOutput(): VicBarsEventOutput<T> {
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
