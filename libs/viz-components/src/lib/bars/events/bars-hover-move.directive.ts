/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { isEqual } from 'lodash-es';
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
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue = string,
  TBarsComponent extends BarsComponent<
    Datum,
    OrdinalDomain,
    ChartMultipleDomain
  > = BarsComponent<Datum, OrdinalDomain, ChartMultipleDomain>,
> extends HoverMoveDirective {
  @Input('vicBarsHoverMoveActions')
  actions: HoverMoveAction<
    BarsHoverMoveDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TBarsComponent
    >
  >[];
  @Output('vicBarsHoverMoveOutput') eventOutput = new EventEmitter<
    BarsEventOutput<Datum, OrdinalDomain, ChartMultipleDomain>
  >();
  barDatum: BarDatum<OrdinalDomain>;
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

    this.bars.sharedContext?.pointerEnter$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ event, multiple }) => {
        if (multiple !== this.bars.multiple.value) {
          this.onElementPointerEnter(event, false);
        }
      });

    this.bars.sharedContext?.pointerMove$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ event, multiple }) => {
        if (multiple !== this.bars.multiple.value) {
          this.onElementPointerMove(event, false);
        }
      });

    this.bars.sharedContext?.pointerLeave$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((multiple) => {
        if (multiple !== this.bars.multiple.value) {
          this.onElementPointerLeave(undefined, false);
        }
      });
  }

  onElementPointerEnter(
    event: PointerEvent,
    isOriginEvent: boolean = true
  ): void {
    if (!this.preventAction) {
      this.barDatum = isOriginEvent
        ? this.getBarDatum(event)
        : this.getBarDatumForThisMultiple(event);
      this.origin = isOriginEvent
        ? (event.target as SVGRectElement)
        : this.getOriginForThisMultiple(event.target as SVGRectElement);
    }
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => {
        if (action.initialize) {
          action.initialize(this);
        }
      });
    }
    if (isOriginEvent) {
      this.bars.sharedContext?.sharePointerEnter(
        event,
        this.bars.multiple.value
      );
    }
  }

  getOriginForThisMultiple(sourceOrigin: SVGRectElement): SVGRectElement {
    // use class to determine if source origin is bar or backgroundBar
    const originClass = sourceOrigin.classList.value;
    const origin = this.bars.barGroups
      .selectAll<SVGRectElement, number>('rect')
      .filter((d, i, nodes) => {
        return (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          isEqual(d, this.barDatum) &&
          originClass === (nodes[i] as SVGRectElement).classList.value
        );
      })
      .node();
    return origin;
  }

  getBarDatum(event: PointerEvent): BarDatum<OrdinalDomain> {
    return select(
      event.target as SVGRectElement
    ).datum() as BarDatum<OrdinalDomain>;
  }

  getBarDatumForThisMultiple(event: PointerEvent): BarDatum<OrdinalDomain> {
    const originBarDatum = this.getBarDatum(event);
    return this.bars.getThisMultipleBarDatumFromEventOriginDatum(
      originBarDatum
    );
  }

  onElementPointerMove(event: PointerEvent, replicateEvent: boolean = true) {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => action.onStart(this));
    }
    if (replicateEvent) {
      this.bars.sharedContext?.sharePointerMove(
        event,
        this.bars.multiple.value
      );
    }
  }

  onElementPointerLeave(
    event: PointerEvent,
    replicateEvent: boolean = true
  ): void {
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => action.onEnd(this));
    }
    this.barDatum = undefined;
    this.origin = undefined;
    if (replicateEvent) {
      this.bars.sharedContext?.sharePointerLeave(this.bars.multiple.value);
    }
  }

  getEventOutput(): BarsEventOutput<Datum, OrdinalDomain, ChartMultipleDomain> {
    const datum = this.bars.getSourceDatumFromBarDatum(this.barDatum);
    const tooltipData = this.bars.getTooltipData(datum);
    const extras = {
      origin: this.origin,
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
    return { ...tooltipData, ...extras };
  }
}
