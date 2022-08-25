import { ContentChildren, Directive, QueryList } from '@angular/core';
import { least, pointer } from 'd3';
import { ChartComponent } from '../chart/chart.component';
import { HoverEvent } from '../events/hover-event';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { LinesEffect } from './lines-effect';
import { LINES_EFFECT } from './lines-effect.token';
import { LinesComponent } from './lines.component';

@Directive({
  selector: 'vzc-lines-on-hover',
  providers: [
    {
      provide: ChartComponent,
      useExisting: XyChartComponent,
    },
  ],
})
export class LinesHoverEvent extends HoverEvent {
  @ContentChildren(LINES_EFFECT) effects!: QueryList<LinesEffect>;

  constructor(public lines: LinesComponent) {
    super();
  }

  chartPointerEnter(event: PointerEvent): void {
    return;
  }

  chartPointerMove(event: PointerEvent) {
    const [pointerX, pointerY] = this.getPointerValuesArray(event);
    if (this.pointerIsInChartArea(pointerX, pointerY)) {
      this.determineHoverStyles(pointerX, pointerY);
    }
  }

  chartPointerLeave(event: PointerEvent) {
    this.effects.forEach((effect) => effect.removeEffect());
  }

  getPointerValuesArray(event: PointerEvent): [number, number] {
    return pointer(event);
  }

  pointerIsInChartArea(pointerX: number, pointerY: number): boolean {
    return (
      pointerX > this.lines.ranges.x[0] &&
      pointerX < this.lines.ranges.x[1] &&
      pointerY > this.lines.ranges.y[1] &&
      pointerY < this.lines.ranges.y[0]
    );
  }

  determineHoverStyles(pointerX: number, pointerY: number): void {
    const closestPointIndex = this.getClosestPointIndex(pointerX, pointerY);
    if (
      this.pointerIsInsideShowTooltipRadius(
        closestPointIndex,
        pointerX,
        pointerY
      )
    ) {
      this.effects.forEach((effect) => effect.applyEffect(closestPointIndex));
    } else {
      this.effects.forEach((effect) => effect.removeEffect());
    }
  }

  getClosestPointIndex(pointerX: number, pointerY: number): number {
    return least(this.lines.values.indicies, (i) =>
      this.getPointerDistanceFromPoint(
        this.lines.values.x[i],
        this.lines.values.y[i],
        pointerX,
        pointerY
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
    const cursorDistanceFromPoint = this.getPointerDistanceFromPoint(
      this.lines.values.x[closestPointIndex],
      this.lines.values.y[closestPointIndex],
      pointerX,
      pointerY
    );
    return cursorDistanceFromPoint < this.lines.config.tooltip.detectionRadius;
  }
}
