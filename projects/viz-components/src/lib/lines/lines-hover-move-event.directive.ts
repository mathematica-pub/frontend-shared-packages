import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { least, pointer } from 'd3';
import { ChartComponent } from '../chart/chart.component';
import { HoverAndMoveEvent } from '../events/hover-move-event';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { LinesHoverAndMoveEffect } from './lines-effect';
import { LinesComponent } from './lines.component';
import { LinesEmittedData } from './lines.model';

@Directive({
  selector: '[vzc-data-marks-lines][vzcLinesHoverAndMoveEffects]',
  providers: [
    {
      provide: ChartComponent,
      useExisting: XyChartComponent,
    },
  ],
})
export class LinesHoverAndMoveEvent extends HoverAndMoveEvent {
  @Input('vzcLinesHoverAndMoveEffects')
  effects: ReadonlyArray<LinesHoverAndMoveEffect>;
  @Input() pointerDetectionRadius = 80;
  @Output('hoverAndMoveData') emittedData =
    new EventEmitter<LinesEmittedData>();

  pointerX: number;
  pointerY: number;
  closestPointIndex: number;

  constructor(public lines: LinesComponent) {
    super();
  }

  chartPointerEnter(event: PointerEvent): void {
    return;
  }

  chartPointerMove(event: PointerEvent) {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    if (this.pointerIsInChartArea()) {
      this.determineHoverStyles();
    }
  }

  chartPointerLeave() {
    this.effects.forEach((effect) => effect.removeEffect(this));
  }

  getPointerValuesArray(event: PointerEvent): [number, number] {
    return pointer(event);
  }

  pointerIsInChartArea(): boolean {
    return (
      this.pointerX > this.lines.ranges.x[0] &&
      this.pointerX < this.lines.ranges.x[1] &&
      this.pointerY > this.lines.ranges.y[1] &&
      this.pointerY < this.lines.ranges.y[0]
    );
  }

  determineHoverStyles(): void {
    this.closestPointIndex = this.getClosestPointIndex();
    if (
      this.pointerIsInsideShowTooltipRadius(
        this.closestPointIndex,
        this.pointerX,
        this.pointerY
      )
    ) {
      this.effects.forEach((effect) => effect.applyEffect(this));
    } else {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
  }

  getClosestPointIndex(): number {
    return least(this.lines.values.indicies, (i) =>
      this.getPointerDistanceFromPoint(
        this.lines.values.x[i],
        this.lines.values.y[i],
        this.pointerX,
        this.pointerY
      )
    );
  }

  getPointerDistanceFromPoint(
    pointX: number,
    pointY: number,
    pointerX: number,
    pointerY: number
  ): number {
    return Math.hypot(
      this.lines.xScale(pointX) - pointerX,
      this.lines.yScale(pointY) - pointerY
    );
  }

  pointerIsInsideShowTooltipRadius(
    closestPointIndex: number,
    pointerX: number,
    pointerY: number
  ): boolean {
    if (
      this.pointerDetectionRadius === null ||
      typeof this.pointerDetectionRadius === 'undefined'
    ) {
      return true;
    } else {
      const cursorDistanceFromPoint = this.getPointerDistanceFromPoint(
        this.lines.values.x[closestPointIndex],
        this.lines.values.y[closestPointIndex],
        pointerX,
        pointerY
      );
      return cursorDistanceFromPoint < this.pointerDetectionRadius;
    }
  }

  emitTooltip(tooltip: LinesEmittedData): void {
    this.emittedData.emit;
  }
}
