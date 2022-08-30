import { Directive, EventEmitter, inject, Input, Output } from '@angular/core';
import { least, pointer } from 'd3';
import { ChartComponent } from '../chart/chart.component';
import { HoverAndMoveEventDirective } from '../events/hover-move-event';
import { ChartComponentStub } from '../testing/stubs/chart.component.stub';
import { XyChartComponentStub } from '../testing/stubs/xy-chart.component.stub';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { LinesSvgEventEffect } from './lines-effect';
import { LinesComponent } from './lines.component';

export class LinesEmittedOutput {
  datum: any;
  color: string;
  x: string;
  y: string;
  category: string;
  positionX?: number;
  positionY?: number;
}

@Directive({
  selector: '[vic-data-marks-lines][vicLinesHoverAndMoveEffects]',
  providers: [
    {
      provide: ChartComponent,
      useExisting: ChartComponentStub,
    },
    {
      provide: XyChartComponent,
      useExisting: XyChartComponentStub,
    },
  ],
})
export class LinesHoverAndMoveEventDirective extends HoverAndMoveEventDirective {
  @Input()
  vicLinesHoverAndMoveEffects: LinesSvgEventEffect[];
  @Input() pointerDetectionRadius: number | null = 80;
  @Output() hoverAndMoveEventOutput = new EventEmitter<LinesEmittedOutput>();
  pointerX: number;
  pointerY: number;
  closestPointIndex: number;
  public lines = inject(LinesComponent);

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
    this.vicLinesHoverAndMoveEffects.forEach((effect) =>
      effect.removeEffect(this)
    );
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
      this.vicLinesHoverAndMoveEffects.forEach((effect) =>
        effect.applyEffect(this)
      );
    } else {
      this.vicLinesHoverAndMoveEffects.forEach((effect) =>
        effect.removeEffect(this)
      );
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
    if (this.pointerDetectionRadius === null) {
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
}
