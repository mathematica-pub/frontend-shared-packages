/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { least } from 'd3';
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
  ExtendedStackedAreaComponent extends StackedAreaComponent<Datum>
> extends HoverMoveDirective {
  @Input('vicStackedAreaHoverMoveEffects')
  effects: HoverMoveEventEffect<
    StackedAreaHoverMoveDirective<Datum, ExtendedStackedAreaComponent>
  >[];
  @Output('vicStackedAreaHoverMoveOutput') eventOutput = new EventEmitter<
    VicStackedAreaEventOutput<Datum>
  >();
  pointerX: number;
  pointerY: number;
  closestXIndicies: number[];

  constructor(
    @Inject(STACKED_AREA) public stackedArea: ExtendedStackedAreaComponent
  ) {
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
    const uniqueXValues = [...new Set(this.stackedArea.config.x.values)];
    const closestXValue = least(uniqueXValues, (x) =>
      Math.abs(this.stackedArea.scales.x(x) - this.pointerX)
    );
    if (isDate(closestXValue)) {
      return this.stackedArea.valueIndicies.filter(
        (i) =>
          this.stackedArea.config.x.values[i].getTime() ===
          closestXValue.getTime()
      );
    } else {
      return this.stackedArea.valueIndicies.filter(
        (i) => this.stackedArea.config.x.values[i] === closestXValue
      );
    }
  }

  getTooltipData(): VicStackedAreaEventOutput<Datum> {
    const tooltipData = getStackedAreaTooltipData(
      this.closestXIndicies,
      this.stackedArea
    );
    tooltipData.svgHeight = this.elements[0].clientHeight;
    return tooltipData;
  }
}
