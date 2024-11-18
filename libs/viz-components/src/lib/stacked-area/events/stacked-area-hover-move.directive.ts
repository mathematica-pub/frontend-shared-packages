/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { InternSet, least } from 'd3';
import { ContinuousValue, DataValue } from '../../core/types/values';
import { isDate } from '../../core/utilities/type-guards';
import { HoverMoveAction } from '../../events/action';
import { HoverMoveDirective } from '../../events/hover-move.directive';
import { STACKED_AREA, StackedAreaComponent } from '../stacked-area.component';
import { StackedAreaEventOutput } from './stacked-area-event-output';

@Directive({
  selector: '[vicStackedAreaHoverMoveActions]',
})
export class StackedAreaHoverMoveDirective<
  Datum,
  TCategoricalValue extends DataValue,
  TStackedAreaComponent extends StackedAreaComponent<
    Datum,
    TCategoricalValue
  > = StackedAreaComponent<Datum, TCategoricalValue>,
> extends HoverMoveDirective {
  @Input('vicStackedAreaHoverMoveActions')
  actions: HoverMoveAction<
    StackedAreaHoverMoveDirective<
      Datum,
      TCategoricalValue,
      TStackedAreaComponent
    >
  >[];
  @Output('vicStackedAreaHoverMoveOutput') eventOutput = new EventEmitter<
    StackedAreaEventOutput<Datum, TCategoricalValue>
  >();
  pointerX: number;
  pointerY: number;
  closestXIndicies: number[];
  categoryYMin: number;
  categoryYMax: number;
  categoryIndex: number;

  constructor(@Inject(STACKED_AREA) public stackedArea: TStackedAreaComponent) {
    super();
  }

  setListenedElements(): void {
    this.elements = [this.stackedArea.chart.svgRef.nativeElement];
    this.setListeners();
  }

  onElementPointerEnter(): void {
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => {
        if (action.initialize) {
          action.initialize(this);
        }
      });
    }
  }

  onElementPointerMove(event: PointerEvent) {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    if (this.pointerIsInChartArea()) {
      this.setClosestXIndicies();
      this.setClosestDatumPosition();
      this.determineHoverStyles();
    }
  }

  onElementPointerLeave() {
    if (this.actions) {
      this.actions.forEach((action) => action.onEnd(this));
    }
  }

  pointerIsInChartArea(): boolean {
    return (
      this.pointerX > this.stackedArea.ranges.x[0] &&
      this.pointerX < this.stackedArea.ranges.x[1] &&
      this.pointerY > this.stackedArea.ranges.y[1] &&
      this.pointerY < this.stackedArea.ranges.y[0]
    );
  }

  setClosestXIndicies(): void {
    this.closestXIndicies = this.getClosestXIndicies();
  }

  determineHoverStyles(): void {
    if (this.actions) {
      this.actions.forEach((action) => action.onStart(this));
    } else {
      this.actions.forEach((action) => action.onEnd(this));
    }
  }

  getClosestXIndicies(): number[] {
    const uniqueXValues = [
      ...new InternSet<ContinuousValue>(this.stackedArea.config.x.values),
    ];
    const closestXValue = least(uniqueXValues, (x) =>
      Math.abs(this.stackedArea.scales.x(x) - this.pointerX)
    );
    if (isDate(closestXValue)) {
      return this.stackedArea.config.valueIndices.filter(
        (i) =>
          (this.stackedArea.config.x.values[i] as Date).getTime() ===
          closestXValue.getTime()
      );
    } else {
      return this.stackedArea.config.valueIndices.filter(
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
      (d) => this.pointerY >= d.categoryYMin && this.pointerY <= d.categoryYMax
    );
    let closestDatum;
    if (closestDatumIndex !== -1) {
      closestDatum = coordinateData[closestDatumIndex];
    }
    this.categoryYMin = closestDatum?.categoryYMin;
    this.categoryYMax = closestDatum?.categoryYMax;
    this.categoryIndex = closestDatum ? closestDatumIndex : undefined;
  }

  getTooltipData(): StackedAreaEventOutput<Datum, TCategoricalValue> {
    const tooltipData = this.stackedArea.getTooltipData(
      this.closestXIndicies,
      this.categoryYMin,
      this.categoryYMax,
      this.categoryIndex
    );
    tooltipData.svgHeight = this.elements[0].clientHeight;
    return tooltipData;
  }
}
