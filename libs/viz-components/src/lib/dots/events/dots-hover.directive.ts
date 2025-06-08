/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { filter } from 'rxjs';
import { DataValue } from '../../core/types/values';
import { EventAction } from '../../events/action';
import { HoverDirective } from '../../events/hover.directive';
import { DotDatum, DOTS, DotsComponent } from '../dots.component';
import { DotsEventOutput } from './dots-event-output';

@Directive({
  selector: '[vicDotsHoverActions]',
})
export class DotsHoverDirective<
  Datum,
  XOrdinalDomain extends DataValue = string,
  YOrdinalDomain extends DataValue = string,
  ChartMultipleDomain extends DataValue = string,
  TDotsComponent extends DotsComponent<
    Datum,
    XOrdinalDomain,
    YOrdinalDomain,
    ChartMultipleDomain
  > = DotsComponent<Datum, XOrdinalDomain, YOrdinalDomain, ChartMultipleDomain>,
> extends HoverDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicDotsHoverActions') actions: EventAction<
    DotsHoverDirective<
      Datum,
      XOrdinalDomain,
      YOrdinalDomain,
      ChartMultipleDomain,
      TDotsComponent
    >
  >[];
  @Output('vicDotsHoverOutput') eventOutput = new EventEmitter<
    DotsEventOutput<Datum>
  >();
  dotDatum: DotDatum;
  origin: SVGCircleElement;
  positionX: number;
  positionY: number;

  constructor(@Inject(DOTS) public dots: TDotsComponent) {
    super();
  }

  setListenedElements(): void {
    this.dots.dots$
      .pipe(
        takeUntilDestroyed(this.dots.destroyRef),
        filter((dotSels) => !!dotSels)
      )
      .subscribe((dotSels) => {
        this.elements = dotSels.nodes();
        this.setListeners();
      });
  }

  onElementPointerEnter(event: PointerEvent): void {
    this.origin = event.target as SVGCircleElement;
    this.dotDatum = select(this.origin).datum() as DotDatum;
    const dotRect = this.origin.getBoundingClientRect();
    this.positionX = dotRect.width / 2;
    this.positionY = dotRect.height / 2;
    if (this.actions) {
      this.actions.forEach((action) => action.onStart(this));
    }
  }

  onElementPointerLeave(): void {
    if (this.actions) {
      this.actions.forEach((action) => action.onEnd(this));
    }
  }

  getEventOutput(): DotsEventOutput<Datum> {
    const tooltipData = this.dots.getTooltipData(this.dotDatum);

    return {
      ...tooltipData,
      origin: this.origin,
      positionX: this.positionX,
      positionY: this.positionY,
    };
  }
}
