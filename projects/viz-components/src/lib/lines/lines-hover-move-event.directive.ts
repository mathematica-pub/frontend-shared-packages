import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { least, pointer } from 'd3';
import { HoverAndMoveEventDirective } from '../events/hover-move-event';
import { LinesHoverAndMoveEffect } from './lines-effect';
import { LINES, LinesComponent } from './lines.component';

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
  selector: '[vicLinesHoverAndMoveEffects]',
})
export class LinesHoverAndMoveEventDirective extends HoverAndMoveEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicLinesHoverAndMoveEffects') effects: LinesHoverAndMoveEffect[];
  @Input() pointerDetectionRadius: number | null = 80;
  @Output() hoverAndMoveEventOutput = new EventEmitter<LinesEmittedOutput>();
  pointerX: number;
  pointerY: number;
  closestPointIndex: number;

  constructor(@Inject(LINES) public lines: LinesComponent) {
    super(lines);
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
