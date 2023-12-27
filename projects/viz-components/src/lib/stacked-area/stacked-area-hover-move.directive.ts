/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { least } from 'd3';
import { UtilitiesService } from '../core/services/utilities.service';
import { HoverMoveEventEffect } from '../events/effect';
import { HoverMoveDirective } from '../events/hover-move.directive';
import {
  getStackedAreaTooltipData,
  VicStackedAreaEventOutput,
} from './stacked-area-tooltip-data';
import { StackedAreaComponent, STACKED_AREA } from './stacked-area.component';

@Directive({
  selector: '[vicStackedAreaHoverMoveEffects]',
})
export class StackedAreaHoverMoveDirective extends HoverMoveDirective {
  @Input('vicStackedAreaHoverMoveEffects')
  effects: HoverMoveEventEffect<StackedAreaHoverMoveDirective>[];
  @Output('vicStackedAreaHoverMoveOutput') eventOutput =
    new EventEmitter<VicStackedAreaEventOutput>();
  pointerX: number;
  pointerY: number;
  closestXIndicies: number[];

  constructor(
    @Inject(STACKED_AREA) public stackedArea: StackedAreaComponent,
    private utilities: UtilitiesService
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
    const uniqueXValues = [...new Set(this.stackedArea.values.x)];
    const closestXValue = least(uniqueXValues, (x) =>
      Math.abs(this.stackedArea.xScale(x) - this.pointerX)
    );
    if (this.utilities.isDate(closestXValue)) {
      return this.stackedArea.values.indicies.filter(
        (i) =>
          this.stackedArea.values.x[i].getTime() === closestXValue.getTime()
      );
    } else {
      return this.stackedArea.values.indicies.filter(
        (i) => this.stackedArea.values.x[i] === closestXValue
      );
    }
  }

  getTooltipData(): VicStackedAreaEventOutput {
    const tooltipData = getStackedAreaTooltipData(
      this.closestXIndicies,
      this.stackedArea
    );
    tooltipData.svgHeight = this.elements[0].clientHeight;
    return tooltipData;
  }
}
