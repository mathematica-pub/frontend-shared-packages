/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { filter } from 'rxjs';
import { BarsEventOutput } from '../../bars';
import { DataValue } from '../../core/types/values';
import { HoverMoveAction } from '../../events/action';
import { HoverMoveDirective } from '../../events/hover-move.directive';
import {
  StackDatum,
  STACKED_BARS,
  StackedBarsComponent,
} from '../stacked-bars.component';

@Directive({
  selector: '[vicStackedBarsHoverMoveActions]',
})
export class StackedBarsHoverMoveDirective<
  Datum,
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue = string,
  TStackedBarsComponent extends StackedBarsComponent<
    Datum,
    OrdinalDomain,
    ChartMultipleDomain
  > = StackedBarsComponent<Datum, OrdinalDomain, ChartMultipleDomain>,
> extends HoverMoveDirective {
  @Input('vicStackedBarsHoverMoveActions')
  actions: HoverMoveAction<
    StackedBarsHoverMoveDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TStackedBarsComponent
    >
  >[];
  @Output('vicStackedBarsHoverMoveOutput') eventOutput = new EventEmitter<
    BarsEventOutput<Datum, OrdinalDomain>
  >();
  origin: SVGRectElement;
  pointerX: number;
  pointerY: number;
  stackedBarDatum: StackDatum;

  constructor(@Inject(STACKED_BARS) public bars: TStackedBarsComponent) {
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
      this.stackedBarDatum = this.getBarDatum(event);
    }
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => {
        if (action.initialize) {
          action.initialize(this);
        }
      });
    }
  }

  getBarDatum(event: PointerEvent): StackDatum {
    return select(event.target as SVGRectElement).datum() as StackDatum;
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
    this.stackedBarDatum = undefined;
    this.origin = undefined;
  }

  getEventOutput(): BarsEventOutput<Datum, OrdinalDomain> {
    const datum = this.bars.getSourceDatumFromStackedBarDatum(
      this.stackedBarDatum
    );
    const rectX = parseFloat(this.origin.getAttribute('x') || '0');
    const rectY = parseFloat(this.origin.getAttribute('y') || '0');
    const tooltipData = this.bars.getTooltipData(datum);
    const extras = {
      origin: this.origin,
      positionX: this.pointerX - rectX,
      positionY: this.pointerY - rectY,
    };
    return { ...tooltipData, ...extras };
  }
}
