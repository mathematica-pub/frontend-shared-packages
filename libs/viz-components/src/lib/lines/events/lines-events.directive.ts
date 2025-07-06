import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { least } from 'd3';
import { Observable, of } from 'rxjs';
import { ContinuousValue } from '../../core/types/values';
import {
  RefactorEventAction,
  RefactorHoverMoveAction,
  RefactorInputEventAction,
} from '../../events/refactor-action';
import {
  EventType,
  MarksHost,
  RefactorEventDirective,
  UnlistenFunction,
} from '../../events/refactor-event.directive';
import { LinesMarkerDatum } from '../config/lines-config';
import {
  LINES,
  LinesComponent,
  LinesGroupSelection,
  MarkerSelection,
} from '../lines.component';
import { LinesInteractionOutput } from './lines-interaction-output';

export interface LinesHost<Datum>
  extends MarksHost<LinesInteractionOutput<Datum>, LinesComponent<Datum>> {
  getClosestPointIndex(): number;
  getClosestLineGroup(): LinesGroupSelection;
  getOtherLineGroups(): LinesGroupSelection;
  getClosestMarker(): MarkerSelection;
  getOtherMarkers(): MarkerSelection;
}

@Directive({
  selector: '[vicLinesEvents]',
})
export class LinesEventsDirective<
    Datum,
    TLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
  >
  extends RefactorEventDirective<LinesHost<Datum>>
  implements LinesHost<Datum>
{
  @Input()
  hoverMoveActions:
    | RefactorHoverMoveAction<LinesHost<Datum>, LinesInteractionOutput<Datum>>[]
    | null;
  @Input()
  clickActions:
    | RefactorEventAction<LinesHost<Datum>, LinesInteractionOutput<Datum>>[]
    | null;
  @Input()
  inputEventActions: RefactorInputEventAction<
    LinesHost<Datum>,
    LinesInteractionOutput<Datum>
  >[];
  @Output() interactionOutput = new EventEmitter<
    LinesInteractionOutput<Datum>
  >();

  closestPointIndex: number;
  actionActive: boolean = false;

  constructor(@Inject(LINES) public lines: TLinesComponent) {
    super();
  }

  get marks(): LinesComponent<Datum> {
    return this.lines;
  }

  getElements(): Observable<Element[]> {
    return of([this.lines.chart.svgRef.nativeElement]);
  }

  getClosestPointIndex(): number {
    return this.closestPointIndex;
  }

  getClosestLineGroup(): LinesGroupSelection {
    return this.marks.lineGroups.filter(
      ([category]) =>
        this.marks.config.stroke.color.values[this.getClosestPointIndex()] ===
        category
    );
  }

  getOtherLineGroups(): LinesGroupSelection {
    return this.marks.lineGroups.filter(
      ([category]) =>
        this.marks.config.stroke.color.values[this.getClosestPointIndex()] !==
        category
    );
  }

  getClosestMarker(): MarkerSelection {
    return this.marks.lineGroups
      .selectAll<SVGCircleElement, LinesMarkerDatum>('circle')
      .filter((d) => d.index === this.getClosestPointIndex());
  }

  getOtherMarkers(): MarkerSelection {
    return this.marks.lineGroups
      .selectAll<SVGCircleElement, LinesMarkerDatum>('circle')
      .filter((d) => d.index !== this.getClosestPointIndex());
  }

  setupListeners(elements: Element[]): UnlistenFunction[] {
    if (this.inputEventActions?.length && this.inputEvent$) {
      this.events.push(EventType.Input);
    }

    return this.bindEventListeners(
      elements,
      this.buildInteractionListeners({
        hoverMove: this.hoverMoveActions?.length && {
          pointerenter: (e, el) => this.onEnter(e, el),
          pointermove: (e, el) => this.onMove(e, el),
          pointerleave: (e, el) => this.onLeave(e, el),
        },
        click: this.clickActions?.length && {
          click: (e, el) => this.onClick(e, el),
        },
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEnter(_: PointerEvent, __: Element): void {
    if (this.isEventAllowed(EventType.HoverMove)) {
      this.runActions(this.hoverMoveActions, (a) => {
        if (a.initialize) {
          a.initialize(this);
        }
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMove(event: PointerEvent, _: Element): void {
    if (this.isEventAllowed(EventType.HoverMove)) {
      this.setPositionsFromPointer(event);
      if (this.pointerIsInChartArea()) {
        this.callPointerEventActions(
          EventType.HoverMove,
          this.hoverMoveActions
        );
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onLeave(_: PointerEvent, __: Element): void {
    if (this.isEventAllowed(EventType.HoverMove)) {
      if (this.actionActive) {
        this.hoverMoveActions.forEach((action) => action.onEnd(this));
        this.actionActive = false;
      }
      this.resetDirective();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick(event: PointerEvent, __: Element): void {
    if (this.isEventAllowed(EventType.Click)) {
      this.setPositionsFromPointer(event);
      if (this.pointerIsInChartArea()) {
        this.callPointerEventActions(EventType.Click, this.clickActions);
      }
    }
  }

  onClickRemove(): void {
    if (this.isEventAllowed(EventType.Click)) {
      this.clickActions.forEach((action) => action.onEnd(this));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  onInputEvent(inputValue: unknown): void {
    if (this.isEventAllowed(EventType.Input)) {
      if (inputValue === null || inputValue === undefined) {
        this.inputEventActions.forEach((action) =>
          action.onEnd(this, inputValue)
        );
      } else {
        this.inputEventActions.forEach((action) =>
          action.onStart(this, inputValue)
        );
      }
    }
  }

  pointerIsInChartArea(): boolean {
    return (
      this.positionX > this.lines.ranges.x[0] &&
      this.positionX < this.lines.ranges.x[1] &&
      this.positionY > this.lines.ranges.y[1] &&
      this.positionY < this.lines.ranges.y[0]
    );
  }

  private callPointerEventActions(
    type: EventType,
    actions: RefactorEventAction<this>[]
  ): void {
    if (!this.isEventAllowed(type)) return;

    this.closestPointIndex = this._getClosestPointIndex();

    const isInside = this.pointerIsInsideShowTooltipRadius(
      this.closestPointIndex,
      this.positionX,
      this.positionY
    );

    if (isInside) {
      actions.forEach((action) => action.onStart(this));
      this.actionActive = true;
    } else {
      this.closestPointIndex = null;
      if (this.actionActive) {
        actions.forEach((action) => action.onEnd(this));
        this.actionActive = false;
      }
    }
  }

  protected _getClosestPointIndex(): number {
    return least(this.lines.config.valueIndices, (i) =>
      this.getPointerDistanceFromPoint(
        this.lines.config.x.values[i],
        this.lines.config.y.values[i],
        this.positionX,
        this.positionY
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

  setPositionsFromElement(): void {
    return;
  }

  getInteractionOutput(type: EventType): LinesInteractionOutput<Datum> {
    const data = this.lines.getTooltipData(this.closestPointIndex);
    return { ...data, type };
  }

  emitInteractionOutput(output: LinesInteractionOutput<Datum>): void {
    this.interactionOutput.emit(output);
  }

  private resetDirective(): void {
    this.closestPointIndex = undefined;
    this.positionX = undefined;
    this.positionY = undefined;
  }
}
