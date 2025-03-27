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

import {
  StackDatum,
  STACKED_BARS,
  StackedBarsComponent,
} from '../stacked-bars.component';

import { BarsEventOutput } from '../../bars';
import { StackedBarsEventDirective } from './stacked-bars-event-directive';
import { StackedBarsHoverMoveDirective } from './stacked-bars-hover-move.directive';
import { StackedBarsHoverDirective } from './stacked-bars-hover.directive';
import { StackedBarsInputEventDirective } from './stacked-bars-input-event.directive';

@Directive({
  selector: '[vicStackedBarsClickActions]',
})
export class StackedBarsClickDirective<
  Datum,
  TOrdinalValue extends DataValue,
  TStackedBarsComponent extends StackedBarsComponent<
    Datum,
    TOrdinalValue
  > = StackedBarsComponent<Datum, TOrdinalValue>,
> extends ClickDirective {
  @Input('vicStackedBarsClickActions')
  actions: EventAction<
    StackedBarsClickDirective<Datum, TOrdinalValue, TStackedBarsComponent>
  >[];
  @Input('vicStackedBarsClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicStackedBarsClickOutput') eventOutput = new EventEmitter<
    BarsEventOutput<Datum, TOrdinalValue>
  >();
  stackedBarDatum: StackDatum;
  origin: SVGRectElement;
  pointerX: number;
  pointerY: number;

  constructor(
    @Inject(STACKED_BARS) public bars: TStackedBarsComponent,
    @Self()
    @Optional()
    public hoverDirective?: StackedBarsHoverDirective<
      Datum,
      TOrdinalValue,
      TStackedBarsComponent
    >,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: StackedBarsHoverMoveDirective<
      Datum,
      TOrdinalValue,
      TStackedBarsComponent
    >,
    @Self()
    @Optional()
    public inputEventDirective?: StackedBarsInputEventDirective<
      Datum,
      TOrdinalValue,
      TStackedBarsComponent
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
    this.stackedBarDatum = select(this.origin).datum() as StackDatum;
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    this.actions.forEach((action) => action.onStart(this));
  }

  onClickRemove(): void {
    this.actions.forEach((action) => action.onEnd(this));
    this.stackedBarDatum = undefined;
    this.origin = undefined;
    this.pointerX = undefined;
    this.pointerY = undefined;
  }

  getEventOutput(): BarsEventOutput<Datum, TOrdinalValue> {
    const datum = this.bars.getSourceDatumFromStackedBarDatum(
      this.stackedBarDatum
    );
    const data = this.bars.getTooltipData(datum);
    const rectX = parseFloat(this.origin.getAttribute('x') || '0');
    const rectY = parseFloat(this.origin.getAttribute('y') || '0');
    const extras = {
      origin: this.origin,
      positionX: this.pointerX - rectX,
      positionY: this.pointerY - rectY,
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
    directive: StackedBarsEventDirective<
      Datum,
      TOrdinalValue,
      TStackedBarsComponent
    >
  ): void {
    if (directive) {
      directive.preventAction = true;
    }
  }

  enableAction(
    directive: StackedBarsEventDirective<
      Datum,
      TOrdinalValue,
      TStackedBarsComponent
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
