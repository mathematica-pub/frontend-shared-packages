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
import { LINES, LinesComponent } from '../lines.component';
import { LinesInteractionOutput } from './lines-interaction-output';

type LinesHost<Datum> = MarksHost<
  LinesInteractionOutput<Datum>,
  LinesComponent<Datum>
>;

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

  setupListeners(elements: Element[]): UnlistenFunction[] {
    const listeners = {};

    if (this.hoverMoveActions?.length) {
      listeners['pointerenter'] = (e: PointerEvent, el: Element) =>
        this.onEnter(e, el);
      listeners['pointermove'] = (e: PointerEvent, el: Element) =>
        this.onMove(e, el);
      listeners['pointerleave'] = (e: PointerEvent, el: Element) =>
        this.onLeave(e, el);
      this.events.push(EventType.HoverMove);
    }

    if (this.clickActions?.length) {
      listeners['click'] = (e: PointerEvent, el: Element) =>
        this.onClick(e, el);
      this.events.push(EventType.Click);
    }

    if (this.inputEventActions?.length && this.inputEvent$) {
      this.events.push(EventType.Input);
    }

    return this.bindEventListeners(elements, listeners);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEnter(_: PointerEvent, __: Element): void {
    if (this.isEventAllowed(EventType.HoverMove)) {
      this.runActions(this.hoverMoveActions, (a) => a.initialize(this));
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
      this.closestPointIndex = null;
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
  onInputEvent(_: any): void {
    if (this.isEventAllowed(EventType.Input)) {
      this.inputEventActions.forEach((action) => action.onStart(this));
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

    this.closestPointIndex = this.getClosestPointIndex();

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

  getClosestPointIndex(): number {
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
}
