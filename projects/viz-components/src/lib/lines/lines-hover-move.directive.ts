/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { least } from 'd3';
import { VicContinuousValue } from '../core/types/values';
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
  TLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>
> extends HoverMoveDirective {
  @Input('vicLinesHoverMoveEffects')
  effects: HoverMoveEventEffect<
    LinesHoverMoveDirective<Datum, TLinesComponent>
  >[];
  @Output('vicLinesHoverMoveOutput') eventOutput = new EventEmitter<
    VicLinesEventOutput<Datum>
  >();
  pointerX: number;
  pointerY: number;
  closestPointIndex: number;
  effectApplied = false;

  constructor(@Inject(LINES) public lines: TLinesComponent) {
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
    return least(this.lines.config.valueIndicies, (i) =>
      this.getPointerDistanceFromPoint(
        this.lines.config.x.values[i],
        this.lines.config.y.values[i],
        this.pointerX,
        this.pointerY
      )
    );
  }

  getPointerDistanceFromPoint(
    xValue: VicContinuousValue,
    yValue: number,
    pointerX: number,
    pointerY: number
  ): number {
    return Math.hypot(
      this.lines.scales.x(xValue) - pointerX,
      this.lines.scales.y(yValue) - pointerY
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
        this.lines.config.x.values[closestPointIndex],
        this.lines.config.y.values[closestPointIndex],
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
