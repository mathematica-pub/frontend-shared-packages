/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { filter } from 'rxjs';
import { DataValue } from '../../core/types/values';
import { HoverMoveAction } from '../../events/action';
import { HoverMoveDirective } from '../../events/hover-move.directive';
import { BarDatum, BARS, BarsComponent } from '../bars.component';
import { BarsEventOutput } from './bars-event-output';

@Directive({
  selector: '[vicBarsHoverMoveActions]',
})
export class BarsHoverMoveDirective<
  Datum,
  TOrdinalValue extends DataValue,
  TBarsComponent extends BarsComponent<Datum, TOrdinalValue> = BarsComponent<
    Datum,
    TOrdinalValue
  >,
> extends HoverMoveDirective {
  @Input('vicBarsHoverMoveActions')
  actions: HoverMoveAction<
    BarsHoverMoveDirective<Datum, TOrdinalValue, TBarsComponent>
  >[];
  @Output('vicBarsHoverMoveOutput') eventOutput = new EventEmitter<
    BarsEventOutput<Datum, TOrdinalValue>
  >();
  barDatum: BarDatum<TOrdinalValue>;
  origin: SVGRectElement;
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
    if (!this.preventAction) {
      this.origin = event.target as SVGRectElement;
      this.barDatum = this.getBarDatum(event);
    }
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => {
        if (action.initialize) {
          action.initialize(this);
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
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => action.onStart(this));
    }
  }

  onElementPointerLeave() {
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => action.onEnd(this));
    }
    this.barDatum = undefined;
    this.origin = undefined;
  }

  getEventOutput(): BarsEventOutput<Datum, TOrdinalValue> {
    const tooltipData = this.bars.getTooltipData(this.barDatum);
    const extras = {
      origin: this.origin,
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
    return { ...tooltipData, ...extras };
  }
}
