import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { InternSet, least } from 'd3';
import { Observable, map } from 'rxjs';
import { ContinuousValue, DataValue } from '../../core/types/values';
import { isDate } from '../../core/utilities/type-guards';
import {
  EventType,
  MarksHost,
  RefactorEventAction,
  RefactorEventDirective,
  RefactorHoverMoveAction,
  RefactorInputEventAction,
  UnlistenFunction,
} from '../../events';
import { STACKED_AREA, StackedAreaComponent } from '../stacked-area.component';
import { StackedAreaInteractionOutput } from './stacked-area-interaction-output';

export type StackedAreaHost<
  Datum,
  TCategoricalValue extends DataValue,
> = MarksHost<
  StackedAreaInteractionOutput<Datum, TCategoricalValue>,
  StackedAreaComponent<Datum, TCategoricalValue>
>;

@Directive({
  selector: '[vicStackedAreaEvents]',
})
export class StackedAreaEventsDirective<
    Datum,
    TCategoricalValue extends DataValue,
    TStackedAreaComponent extends StackedAreaComponent<
      Datum,
      TCategoricalValue
    > = StackedAreaComponent<Datum, TCategoricalValue>,
  >
  extends RefactorEventDirective<StackedAreaHost<Datum, TCategoricalValue>>
  implements StackedAreaHost<Datum, TCategoricalValue>
{
  @Input()
  hoverMoveActions:
    | RefactorHoverMoveAction<
        StackedAreaHost<Datum, TCategoricalValue>,
        StackedAreaInteractionOutput<Datum, TCategoricalValue>
      >[]
    | null;
  @Input()
  clickActions:
    | RefactorEventAction<
        StackedAreaHost<Datum, TCategoricalValue>,
        StackedAreaInteractionOutput<Datum, TCategoricalValue>
      >[]
    | null;
  @Input()
  inputEventActions: RefactorInputEventAction<
    StackedAreaHost<Datum, TCategoricalValue>,
    StackedAreaInteractionOutput<Datum, TCategoricalValue>
  >[];
  @Output() interactionOutput = new EventEmitter<StackedAreaInteractionOutput<
    Datum,
    TCategoricalValue
  > | null>();

  closestXIndicies: number[];
  categoryYMin: number;
  categoryYMax: number;
  categoryIndex: number;

  constructor(@Inject(STACKED_AREA) public stackedArea: TStackedAreaComponent) {
    super();
  }

  get marks(): StackedAreaComponent<Datum, TCategoricalValue> {
    return this.stackedArea;
  }

  getElements(): Observable<Element[]> {
    return this.stackedArea.stackedAreas$.pipe(map((sel) => sel.nodes()));
  }

  setupListeners(elements: Element[]): UnlistenFunction[] {
    if (this.inputEventActions?.length && this.inputEvent$) {
      this.events.push(EventType.Input);
    }

    return this.bindEventListeners(
      elements,
      this.buildInteractionListeners({
        hoverMove: this.hoverMoveActions?.length && {
          pointerenter: (e, el) => this.onEnter(e, el),
          pointermove: (e, el) => this.onMove(e, el),
          pointerleave: (e, el) => this.onLeave(e, el),
        },
        click: this.clickActions?.length && {
          click: (e, el) => this.onClick(e, el),
        },
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEnter(_: PointerEvent, __: Element): void {
    if (this.isEventAllowed(EventType.HoverMove)) {
      this.runActions(this.hoverMoveActions, (a) => {
        if (a.initialize) {
          a.initialize(this.asHost());
        }
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMove(event: PointerEvent, _: Element): void {
    if (this.isEventAllowed(EventType.HoverMove)) {
      this.setPositionsFromPointer(event);
      if (this.pointerIsInChartArea()) {
        this.setClosestXIndicies();
        this.setClosestDatumPosition();
        this.hoverMoveActions.forEach((action) =>
          action.onStart(this.asHost())
        );
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onLeave(_: PointerEvent, __: Element): void {
    if (this.isEventAllowed(EventType.HoverMove)) {
      this.hoverMoveActions.forEach((action) => action.onEnd(this.asHost()));
    }
    this.resetDirective();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick(event: PointerEvent, _: Element): void {
    if (this.isEventAllowed(EventType.Click)) {
      this.setPositionsFromPointer(event);
      this.runActions(this.clickActions, (a) => a.onStart(this.asHost()));
    }
  }

  onInputEvent(inputValue: unknown): void {
    if (this.isEventAllowed(EventType.Input)) {
      if (inputValue === null || inputValue === undefined) {
        this.inputEventActions.forEach((action) =>
          action.onEnd(this.asHost(), inputValue)
        );
      } else {
        this.inputEventActions.forEach((action) =>
          action.onStart(this.asHost(), inputValue)
        );
      }
    }
  }

  onClickRemove(): void {
    if (!this.preventAction.click) {
      this.runActions(this.clickActions, (a) => a.onEnd(this.asHost()));
      this.resetDirective();
    }
  }

  setPositionsFromElement(): void {
    const barRect = this.origin.getBoundingClientRect();
    this.positionX = barRect.width / 2;
    this.positionY = barRect.height / 2;
  }

  pointerIsInChartArea(): boolean {
    return (
      this.positionX > this.stackedArea.ranges.x[0] &&
      this.positionX < this.stackedArea.ranges.x[1] &&
      this.positionY > this.stackedArea.ranges.y[1] &&
      this.positionY < this.stackedArea.ranges.y[0]
    );
  }

  setClosestXIndicies(): void {
    const uniqueXValues = [
      ...new InternSet<ContinuousValue>(this.stackedArea.config.x.values),
    ];
    const closestXValue = least(uniqueXValues, (x) =>
      Math.abs(this.stackedArea.scales.x(x) - this.positionX)
    );
    if (isDate(closestXValue)) {
      this.closestXIndicies = this.stackedArea.config.valueIndices.filter(
        (i) =>
          (this.stackedArea.config.x.values[i] as Date).getTime() ===
          closestXValue.getTime()
      );
    } else {
      this.closestXIndicies = this.stackedArea.config.valueIndices.filter(
        (i) => this.stackedArea.config.x.values[i] === closestXValue
      );
    }
  }

  setClosestDatumPosition(): void {
    const dataAtXValue = this.stackedArea.config.series
      .flatMap((strat) => strat)
      .filter((d) => this.closestXIndicies.includes(d.i));
    const coordinateData = dataAtXValue.map((d) => ({
      categoryYMin: this.stackedArea.scales.y(d[1]),
      categoryYMax: this.stackedArea.scales.y(d[0]),
      i: d.i,
    }));
    const closestDatumIndex = coordinateData.findIndex(
      (d) =>
        this.positionY >= d.categoryYMin && this.positionY <= d.categoryYMax
    );
    let closestDatum;
    if (closestDatumIndex !== -1) {
      closestDatum = coordinateData[closestDatumIndex];
    }
    this.categoryYMin = closestDatum?.categoryYMin;
    this.categoryYMax = closestDatum?.categoryYMax;
    this.categoryIndex = closestDatum ? closestDatumIndex : undefined;
  }

  getInteractionOutput(
    type: EventType
  ): StackedAreaInteractionOutput<Datum, TCategoricalValue> {
    const tooltipData = this.stackedArea.getTooltipData(
      this.closestXIndicies,
      this.categoryYMin,
      this.categoryYMax,
      this.categoryIndex
    );
    return {
      ...tooltipData,
      svgHeight: this.stackedArea.chart.svgRef.nativeElement.getBBox().height,
      type,
    };
  }

  emitInteractionOutput(
    output: StackedAreaInteractionOutput<Datum, TCategoricalValue>
  ): void {
    this.interactionOutput.emit(output);
  }

  resetDirective(): void {
    this.closestXIndicies = [];
    this.categoryYMin = undefined;
    this.categoryYMax = undefined;
    this.categoryIndex = undefined;
  }
}
