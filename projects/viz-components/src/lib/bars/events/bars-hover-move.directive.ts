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
import { DataValue } from '../../core/types/values';
import { HoverMoveEventEffect } from '../../events/effect';
import { HoverMoveDirective } from '../../events/hover-move.directive';
import { BarDatum, BARS, BarsComponent } from '../bars.component';
import { BarsEventOutput } from './bars-event-output';
import { barsTooltipMixin } from './bars-tooltip';

@Directive({
  selector: '[vicBarsHoverMoveEffects]',
})
export class BarsHoverMoveDirective<
  Datum,
  TOrdinalValue extends DataValue,
  TBarsComponent extends BarsComponent<Datum, TOrdinalValue> = BarsComponent<
    Datum,
    TOrdinalValue
  >
> extends barsTooltipMixin(HoverMoveDirective) {
  @Input('vicBarsHoverMoveEffects')
  effects: HoverMoveEventEffect<
    BarsHoverMoveDirective<Datum, TOrdinalValue, TBarsComponent>
  >[];
  @Output('vicBarsHoverMoveOutput') eventOutput = new EventEmitter<
    BarsEventOutput<Datum, TOrdinalValue>
  >();
  barDatum: BarDatum<TOrdinalValue>;
  elRef: ElementRef;
  pointerX: number;
  pointerY: number;

  constructor(@Inject(BARS) public bars: TBarsComponent) {
    super();
  }

  setListenedElements(): void {
    this.bars.bars$
      .pipe(
        takeUntilDestroyed(this.bars.destroyRef),
        filter((barSels) => !!barSels)
      )
      .subscribe((barSels) => {
        this.elements = barSels.nodes();
        this.setListeners();
      });
  }

  onElementPointerEnter(event: PointerEvent): void {
    if (!this.preventEffect) {
      this.barDatum = this.getBarDatum(event);
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

  getBarDatum(event: PointerEvent): BarDatum<TOrdinalValue> {
    return select(
      event.target as SVGRectElement
    ).datum() as BarDatum<TOrdinalValue>;
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
    this.barDatum = undefined;
    this.elRef = undefined;
  }

  getEventOutput(): BarsEventOutput<Datum, TOrdinalValue> {
    const tooltipData = this.getBarsTooltipData(
      this.barDatum,
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
