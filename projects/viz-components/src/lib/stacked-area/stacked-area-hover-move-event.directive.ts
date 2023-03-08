import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { least } from 'd3';
import { UtilitiesService } from '../core/services/utilities.service';
import { EventEffect } from '../events/effect';
import { HoverAndMoveEventDirective } from '../events/hover-move-event';
import { StackedAreaComponent, STACKED_AREA } from './stacked-area.component';

export class StackedAreaEmittedOutput {
  data: StackedAreaEmittedDatum[];
  positionX?: number;
  svgHeight: number;
}

export class StackedAreaEmittedDatum {
  datum: any[];
  color: string;
  x: string;
  y: string;
  category: string;
}

@Directive({
  selector: '[vicStackedAreaHoverAndMoveEffects]',
})
export class StackedAreaHoverAndMoveEventDirective extends HoverAndMoveEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('appStackedAreaHoverAndMoveEffects')
  effects: EventEffect<StackedAreaHoverAndMoveEventDirective>[];
  @Output() hoverAndMoveEventOutput =
    new EventEmitter<StackedAreaEmittedOutput>();
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

  elementPointerEnter(): void {
    return;
  }

  elementPointerMove(event: PointerEvent) {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    if (this.pointerIsInChartArea()) {
      this.setClosestXIndicies();
      this.determineHoverStyles();
    }
  }

  elementPointerLeave() {
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
}
