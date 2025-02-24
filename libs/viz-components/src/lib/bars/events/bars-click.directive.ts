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
import { Observable, filter } from 'rxjs';
import { DataValue } from '../../core/types/values';
import { EventAction } from '../../events/action';
import { ClickDirective } from '../../events/click.directive';
import { BARS, BarDatum, BarsComponent } from '../bars.component';
import { BarsEventDirective } from './bars-event-directive';
import { BarsEventOutput } from './bars-event-output';
import { BarsHoverMoveDirective } from './bars-hover-move.directive';
import { BarsHoverDirective } from './bars-hover.directive';
import { BarsInputEventDirective } from './bars-input-event.directive';

@Directive({
  selector: '[vicBarsClickActions]',
})
export class BarsClickDirective<
  Datum,
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue = string,
  TBarsComponent extends BarsComponent<
    Datum,
    OrdinalDomain,
    ChartMultipleDomain
  > = BarsComponent<Datum, OrdinalDomain, ChartMultipleDomain>,
> extends ClickDirective {
  @Input('vicBarsClickActions')
  actions: EventAction<
    BarsClickDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TBarsComponent
    >
  >[];
  @Input('vicBarsClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicBarsClickOutput') eventOutput = new EventEmitter<
    BarsEventOutput<Datum, OrdinalDomain>
  >();
  barDatum: BarDatum<OrdinalDomain>;
  origin: SVGRectElement;
  pointerX: number;
  pointerY: number;

  constructor(
    @Inject(BARS) public bars: TBarsComponent,
    @Self()
    @Optional()
    public hoverDirective?: BarsHoverDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TBarsComponent
    >,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: BarsHoverMoveDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TBarsComponent
    >,
    @Self()
    @Optional()
    public inputEventDirective?: BarsInputEventDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TBarsComponent
    >
  ) {
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

  onElementClick(event: PointerEvent): void {
    this.origin = event.target as SVGRectElement;
    this.barDatum = select(this.origin).datum() as BarDatum<OrdinalDomain>;
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    if (this.hoverDirective) {
      this.pointerX = this.hoverDirective.positionX;
      this.pointerY = this.hoverDirective.positionY;
    }
    this.actions.forEach((action) => action.onStart(this));
  }

  onClickRemove(): void {
    this.actions.forEach((action) => action.onEnd(this));
    this.barDatum = undefined;
    this.origin = undefined;
    this.pointerX = undefined;
    this.pointerY = undefined;
  }

  getEventOutput(): BarsEventOutput<Datum, OrdinalDomain> {
    const datum = this.bars.getSourceDatumFromBarDatum(this.barDatum);
    const data = this.bars.getTooltipData(datum);
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
    directive: BarsEventDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TBarsComponent
    >
  ): void {
    if (directive) {
      directive.preventAction = true;
    }
  }

  enableAction(
    directive: BarsEventDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TBarsComponent
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
