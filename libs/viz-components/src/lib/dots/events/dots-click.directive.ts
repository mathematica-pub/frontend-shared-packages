/* eslint-disable @angular-eslint/no-output-rename */
/* eslint-disable @angular-eslint/no-input-rename */
import {
  Directive,
  EventEmitter,
  Inject,
  Input,
  Optional,
  Output,
  Self,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { filter, Observable } from 'rxjs';
import { DataValue } from '../../core/types/values';
import { EventAction } from '../../events/action';
import { ClickDirective } from '../../events/click.directive';
import { DotDatum, DOTS, DotsComponent } from '../dots.component';
import { DotsEventDirective } from './dots-event-directive';
import { DotsEventOutput } from './dots-event-output';
import { DotsHoverMoveDirective } from './dots-hover-move.directive';
import { DotsHoverDirective } from './dots-hover.directive';
import { DotsInputEventDirective } from './dots-input.directive';

@Directive({
  selector: '[vicDotsClickActions]',
})
export class DotsClickDirective<
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
> extends ClickDirective {
  @Input('vicDotsClickActions')
  actions: EventAction<
    DotsClickDirective<
      Datum,
      XOrdinalDomain,
      YOrdinalDomain,
      ChartMultipleDomain,
      TDotsComponent
    >
  >[];
  @Input('vicDotsClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicDotsClickOutput') eventOutput = new EventEmitter<
    DotsEventOutput<Datum>
  >();
  dotDatum: DotDatum;
  origin: SVGCircleElement;
  pointerX: number;
  pointerY: number;

  constructor(
    @Inject(DOTS) public dots: TDotsComponent,
    @Self()
    @Optional()
    public hoverDirective?: DotsHoverDirective<
      Datum,
      XOrdinalDomain,
      YOrdinalDomain,
      ChartMultipleDomain,
      TDotsComponent
    >,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: DotsHoverMoveDirective<
      Datum,
      XOrdinalDomain,
      YOrdinalDomain,
      ChartMultipleDomain,
      TDotsComponent
    >,
    @Self()
    @Optional()
    public inputEventDirective?: DotsInputEventDirective<
      Datum,
      XOrdinalDomain,
      YOrdinalDomain,
      ChartMultipleDomain,
      TDotsComponent
    >
  ) {
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

  onElementClick(event: PointerEvent): void {
    this.origin = event.target as SVGCircleElement;
    this.dotDatum = select(this.origin).datum() as DotDatum;
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    if (this.hoverDirective) {
      this.pointerX = this.hoverDirective.positionX;
      this.pointerY = this.hoverDirective.positionY;
    }
    this.actions.forEach((action) => action.onStart(this));
  }

  onClickRemove(): void {
    this.actions.forEach((action) => action.onEnd(this));
    this.dotDatum = undefined;
    this.origin = undefined;
    this.pointerX = undefined;
    this.pointerY = undefined;
  }

  getEventOutput(): DotsEventOutput<Datum> {
    const data = this.dots.getTooltipData(this.dotDatum);
    const extras = {
      origin: this.origin,
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
    return { ...data, ...extras };
  }

  disableHoverActions(): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) => this.disableAction(directive));
  }

  resumeHoverActions(cancelCurrentActions = true): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) =>
      this.enableAction(directive, cancelCurrentActions)
    );
  }

  preventInputEventActions(): void {
    this.disableAction(this.inputEventDirective);
  }

  resumeInputEventActions(cancelCurrentActions = true): void {
    this.enableAction(this.inputEventDirective, cancelCurrentActions);
  }

  disableAction(
    directive: DotsEventDirective<
      Datum,
      XOrdinalDomain,
      YOrdinalDomain,
      ChartMultipleDomain,
      TDotsComponent
    >
  ): void {
    if (directive) {
      directive.preventAction = true;
    }
  }

  enableAction(
    directive: DotsEventDirective<
      Datum,
      XOrdinalDomain,
      YOrdinalDomain,
      ChartMultipleDomain,
      TDotsComponent
    >,
    cancelCurrentActions: boolean
  ): void {
    if (directive) {
      directive.preventAction = false;
      if (cancelCurrentActions) {
        directive.actions.forEach((action) => action.onEnd(directive));
      }
    }
  }
}
