/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { filter } from 'rxjs';
import { BarsEventOutput } from '../../bars';
import { DataValue } from '../../core/types/values';
import { EventAction } from '../../events/action';
import { HoverDirective } from '../../events/hover.directive';
import {
  StackDatum,
  STACKED_BARS,
  StackedBarsComponent,
} from '../stacked-bars.component';

@Directive({
  selector: '[vicStackedBarsHoverActions]',
})
export class StackedBarsHoverDirective<
  Datum,
  TOrdinalValue extends DataValue,
  TStackedBarsComponent extends StackedBarsComponent<
    Datum,
    TOrdinalValue
  > = StackedBarsComponent<Datum, TOrdinalValue>,
> extends HoverDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicStackedBarsHoverActions') actions: EventAction<
    StackedBarsHoverDirective<Datum, TOrdinalValue, TStackedBarsComponent>
  >[];
  @Output('vicStackedBarsHoverOutput') eventOutput = new EventEmitter<
    BarsEventOutput<Datum, TOrdinalValue>
  >();
  stackedBarDatum: StackDatum;
  origin: SVGRectElement;
  positionX: number;
  positionY: number;

  constructor(@Inject(STACKED_BARS) public bars: TStackedBarsComponent) {
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
    this.stackedBarDatum = select(
      event.target as SVGRectElement
    ).datum() as StackDatum;
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

  getEventOutput(): BarsEventOutput<Datum, TOrdinalValue> {
    const datum = this.bars.getSourceDatumFromStackedBarDatum(
      this.stackedBarDatum
    );
    const tooltipData = this.bars.getTooltipData(datum);

    return {
      ...tooltipData,
      origin: this.origin,
      positionX: this.positionX,
      positionY: this.positionY,
    };
  }
}
