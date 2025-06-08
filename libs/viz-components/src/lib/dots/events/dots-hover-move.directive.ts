/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { filter } from 'rxjs';
import { DataValue } from '../../core/types/values';
import { HoverMoveAction } from '../../events/action';
import { HoverMoveDirective } from '../../events/hover-move.directive';
import { DotDatum, DOTS, DotsComponent } from '../dots.component';
import { DotsEventOutput } from './dots-event-output';

@Directive({
  selector: '[vicDotsHoverMoveActions]',
})
export class DotsHoverMoveDirective<
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
> extends HoverMoveDirective {
  @Input('vicDotsHoverMoveActions')
  actions: HoverMoveAction<
    DotsHoverMoveDirective<
      Datum,
      XOrdinalDomain,
      YOrdinalDomain,
      ChartMultipleDomain,
      TDotsComponent
    >
  >[];
  @Output('vicDotsHoverMoveOutput') eventOutput = new EventEmitter<
    DotsEventOutput<Datum>
  >();
  dotDatum: DotDatum;
  origin: SVGCircleElement;
  pointerX: number;
  pointerY: number;

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
    if (!this.preventAction) {
      this.origin = event.target as SVGCircleElement;
      this.dotDatum = this.getDotDatum();
    }
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => {
        if (action.initialize) {
          action.initialize(this);
        }
      });
    }
  }

  getDotDatum(): DotDatum {
    return select(this.origin).datum() as DotDatum;
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
    this.dotDatum = undefined;
    this.origin = undefined;
  }

  getEventOutput(): DotsEventOutput<Datum> {
    const tooltipData = this.dots.getTooltipData(this.dotDatum);
    const extras = {
      origin: this.origin,
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
    return { ...tooltipData, ...extras };
  }
}
