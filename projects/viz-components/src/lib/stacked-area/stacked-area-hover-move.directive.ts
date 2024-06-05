/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { InternSet, least } from 'd3';
import { VicContinuousValue, VicDataValue } from '../core/types/values';
import { isDate } from '../core/utilities/type-guards';
import { HoverMoveEventEffect } from '../events/effect';
import { HoverMoveDirective } from '../events/hover-move.directive';
import {
  VicStackedAreaEventOutput,
  getStackedAreaTooltipData,
} from './stacked-area-tooltip-data';
import { STACKED_AREA, StackedAreaComponent } from './stacked-area.component';

@Directive({
  selector: '[vicStackedAreaHoverMoveEffects]',
})
export class StackedAreaHoverMoveDirective<
  Datum,
  TCategoricalValue extends VicDataValue,
  TStackedAreaComponent extends StackedAreaComponent<Datum, TCategoricalValue>
> extends HoverMoveDirective {
  @Input('vicStackedAreaHoverMoveEffects')
  effects: HoverMoveEventEffect<
    StackedAreaHoverMoveDirective<
      Datum,
      TCategoricalValue,
      TStackedAreaComponent
    >
  >[];
  @Output('vicStackedAreaHoverMoveOutput') eventOutput = new EventEmitter<
    VicStackedAreaEventOutput<Datum, TCategoricalValue>
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
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => {
        if (effect.initializeEffect) {
          effect.initializeEffect(this);
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
    if (this.effects) {
      this.effects.forEach((effect) => effect.removeEffect(this));
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
    if (this.effects) {
      this.effects.forEach((effect) => effect.applyEffect(this));
    } else {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
  }

  getClosestXIndicies(): number[] {
    const uniqueXValues = [
      ...new InternSet<VicContinuousValue>(this.stackedArea.config.x.values),
    ];
    const closestXValue = least(uniqueXValues, (x) =>
      Math.abs(this.stackedArea.scales.x(x) - this.pointerX)
    );
    if (isDate(closestXValue)) {
      return this.stackedArea.config.valueIndicies.filter(
        (i) =>
          (this.stackedArea.config.x.values[i] as Date).getTime() ===
          closestXValue.getTime()
      );
    } else {
      return this.stackedArea.config.valueIndicies.filter(
        (i) => this.stackedArea.config.x.values[i] === closestXValue
      );
    }
  }

  setClosestDatumPosition(): void {
    const dataAtXValue = this.stackedArea.series
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

  getTooltipData(): VicStackedAreaEventOutput<Datum, TCategoricalValue> {
    const tooltipData = getStackedAreaTooltipData(
      this.closestXIndicies,
      this.categoryYMin,
      this.categoryYMax,
      this.categoryIndex,
      this.stackedArea
    );
    tooltipData.svgHeight = this.elements[0].clientHeight;
    return tooltipData;
  }
}
