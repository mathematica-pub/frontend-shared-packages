/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { filter } from 'rxjs';
import { DataValue } from '../../core/types/values';
import { EventAction } from '../../events/action';
import { HoverDirective } from '../../events/hover.directive';
import { BarDatum, BARS, BarsComponent } from '../bars.component';
import { BarsEventOutput } from './bars-event-output';

@Directive({
  selector: '[vicBarsHoverActions]',
})
export class BarsHoverDirective<
  Datum,
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue = string,
  TBarsComponent extends BarsComponent<
    Datum,
    OrdinalDomain,
    ChartMultipleDomain
  > = BarsComponent<Datum, OrdinalDomain, ChartMultipleDomain>,
> extends HoverDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicBarsHoverActions') actions: EventAction<
    BarsHoverDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TBarsComponent
    >
  >[];
  @Output('vicBarsHoverOutput') eventOutput = new EventEmitter<
    BarsEventOutput<Datum, OrdinalDomain>
  >();
  barDatum: BarDatum<OrdinalDomain>;
  origin: SVGRectElement;
  positionX: number;
  positionY: number;

  constructor(@Inject(BARS) public bars: TBarsComponent) {
    super();
  }

  setListenedElements(): void {
    this.bars.bars$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((barSels) => !!barSels)
      )
      .subscribe((barSels) => {
        this.elements = barSels.nodes();
        this.setListeners();
      });
  }

  onElementPointerEnter(event: PointerEvent): void {
    this.barDatum = select(
      event.target as SVGRectElement
    ).datum() as BarDatum<OrdinalDomain>;
    this.origin = event.target as SVGRectElement;
    const barRect = this.origin.getBoundingClientRect();
    this.positionX = barRect.width / 2;
    this.positionY = barRect.height / 2;
    if (this.actions) {
      this.actions.forEach((action) => action.onStart(this));
    }
  }

  onElementPointerLeave(): void {
    if (this.actions) {
      this.actions.forEach((action) => action.onEnd(this));
    }
  }

  getEventOutput(): BarsEventOutput<Datum, OrdinalDomain> {
    const datum = this.bars.getSourceDatumFromBarDatum(this.barDatum);
    const tooltipData = this.bars.getTooltipData(datum);

    return {
      ...tooltipData,
      origin: this.origin,
      positionX: this.positionX,
      positionY: this.positionY,
    };
  }
}
