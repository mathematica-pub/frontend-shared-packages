/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { least } from 'd3';
import { ContinuousValue } from '../../core/types/values';
import { HoverMoveAction } from '../../events/action';
import { HoverMoveDirective } from '../../events/hover-move.directive';
import { LINES, LinesComponent } from '../lines.component';
import { LinesEventOutput } from './lines-event-output';

@Directive({
  selector: '[vicLinesHoverMoveActions]',
  standalone: false,
})
export class LinesHoverMoveDirective<
  Datum,
  TLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> extends HoverMoveDirective {
  @Input('vicLinesHoverMoveActions')
  actions: HoverMoveAction<LinesHoverMoveDirective<Datum, TLinesComponent>>[];
  @Output('vicLinesHoverMoveOutput') eventOutput = new EventEmitter<
    LinesEventOutput<Datum>
  >();
  pointerX: number;
  pointerY: number;
  closestPointIndex: number;
  actionActive = false;

  constructor(@Inject(LINES) public lines: TLinesComponent) {
    super();
  }

  setListenedElements(): void {
    this.elements = [this.lines.chart.svgRef.nativeElement];
    this.setListeners();
  }

  onElementPointerEnter(): void {
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => {
        if (action.initialize) {
          action.initialize(this);
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

  onElementPointerLeave(): void {
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => action.onEnd(this));
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
    if (this.actions && !this.preventAction) {
      if (
        this.pointerIsInsideShowTooltipRadius(
          this.closestPointIndex,
          this.pointerX,
          this.pointerY
        )
      ) {
        this.actions.forEach((action) => {
          action.onStart(this);
        });
        this.actionActive = true;
      } else {
        this.closestPointIndex = null;
        if (this.actionActive) {
          this.actions.forEach((action) => action.onEnd(this));
          this.actionActive = false;
        }
      }
    }
  }

  getClosestPointIndex(): number {
    return least(this.lines.config.valueIndices, (i) =>
      this.getPointerDistanceFromPoint(
        this.lines.config.x.values[i],
        this.lines.config.y.values[i],
        this.pointerX,
        this.pointerY
      )
    );
  }

  getPointerDistanceFromPoint(
    xValue: ContinuousValue,
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

  getEventOutput(): LinesEventOutput<Datum> {
    const data = this.lines.getTooltipData(this.closestPointIndex);
    return data;
  }
}
