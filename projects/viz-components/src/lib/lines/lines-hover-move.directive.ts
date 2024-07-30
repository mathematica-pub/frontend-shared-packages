/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { least } from 'd3';
import { HoverMoveEventEffect } from '../events/effect';
import { HoverMoveDirective } from '../events/hover-move.directive';
import {
  VicLinesEventOutput,
  getLinesTooltipDataFromDatum,
} from './lines-tooltip-data';
import { LINES, LinesComponent } from './lines.component';

@Directive({
  selector: '[vicLinesHoverMoveEffects]',
})
export class LinesHoverMoveDirective<
  Datum,
  ExtendedLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> extends HoverMoveDirective {
  @Input('vicLinesHoverMoveEffects')
  effects: HoverMoveEventEffect<
    LinesHoverMoveDirective<Datum, ExtendedLinesComponent>
  >[];
  @Output('vicLinesHoverMoveOutput') eventOutput = new EventEmitter<
    VicLinesEventOutput<Datum>
  >();
  pointerX: number;
  pointerY: number;
  closestPointIndex: number;
  effectApplied = false;

  constructor(@Inject(LINES) public lines: ExtendedLinesComponent) {
    super();
  }

  setListenedElements(): void {
    this.elements = [this.lines.chart.svgRef.nativeElement];
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
      this.determineHoverStyles();
    }
  }

  onElementPointerLeave() {
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
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
    if (this.effects && !this.preventEffect) {
      if (
        this.pointerIsInsideShowTooltipRadius(
          this.closestPointIndex,
          this.pointerX,
          this.pointerY
        )
      ) {
        this.effects.forEach((effect) => {
          effect.applyEffect(this);
        });
        this.effectApplied = true;
      } else {
        this.closestPointIndex = null;
        if (this.effectApplied) {
          this.effects.forEach((effect) => effect.removeEffect(this));
          this.effectApplied = false;
        }
      }
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
      this.lines.scales.x(pointX) - pointerX,
      this.lines.scales.y(pointY) - pointerY
    );
  }

  pointerIsInsideShowTooltipRadius(
    closestPointIndex: number,
    pointerX: number,
    pointerY: number
  ): boolean {
    if (!this.lines.config.pointerDetectionRadius) {
      return true;
    } else {
      const cursorDistanceFromPoint = this.getPointerDistanceFromPoint(
        this.lines.values.x[closestPointIndex],
        this.lines.values.y[closestPointIndex],
        pointerX,
        pointerY
      );
      return cursorDistanceFromPoint < this.lines.config.pointerDetectionRadius;
    }
  }

  getEventOutput(): VicLinesEventOutput<Datum> {
    const data = getLinesTooltipDataFromDatum(
      this.closestPointIndex,
      this.lines
    );
    return data;
  }
}
