/* eslint-disable @angular-eslint/no-output-rename */
/* eslint-disable @angular-eslint/no-input-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { select } from 'd3';
import { Observable, map } from 'rxjs';
import {
  EventType,
  MarksHost,
  RefactorEventAction,
  RefactorEventDirective,
  RefactorHoverMoveAction,
  RefactorInputEventAction,
  UnlistenFunction,
} from '../../events';
import { LinesMarkerDatum } from '../config/lines-config';
import { LINES, LinesComponent } from '../lines.component';
import { LinesInteractionOutput } from './lines-interaction-output';

export interface LinesMarkersHost<Datum>
  extends MarksHost<LinesInteractionOutput<Datum>, LinesComponent<Datum>> {
  getOrigin(): SVGCircleElement | null;
}

@Directive({
  selector: '[vicLinesMarkersEvents]',
})
export class LinesMarkersEventsDirective<
  Datum,
  TLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> extends RefactorEventDirective<LinesMarkersHost<Datum>> {
  @Input()
  hoverActions:
    | RefactorEventAction<
        LinesMarkersHost<Datum>,
        LinesInteractionOutput<Datum>
      >[]
    | null;
  @Input()
  hoverMoveActions:
    | RefactorHoverMoveAction<
        LinesMarkersHost<Datum>,
        LinesInteractionOutput<Datum>
      >[]
    | null;
  @Input()
  clickActions:
    | RefactorEventAction<
        LinesMarkersHost<Datum>,
        LinesInteractionOutput<Datum>
      >[]
    | null;
  @Input()
  inputEventActions: RefactorInputEventAction<
    LinesMarkersHost<Datum>,
    LinesInteractionOutput<Datum>
  >[];
  @Output() interactionOutput = new EventEmitter<
    LinesInteractionOutput<Datum>
  >();
  /**
   * The index of the point that was clicked in the LinesComponent's values array.
   */
  pointIndex: number;
  markerDatum: LinesMarkerDatum;
  origin: SVGCircleElement;

  constructor(@Inject(LINES) public lines: TLinesComponent) {
    super();
  }

  get marks(): LinesComponent<Datum> {
    return this.lines;
  }

  getOrigin(): SVGCircleElement | null {
    return this.origin;
  }

  getElements(): Observable<Element[]> {
    return this.lines.markers$.pipe(map((sel) => sel.nodes()));
  }

  setupListeners(elements: Element[]): UnlistenFunction[] {
    const listeners = {};

    if (this.hoverActions?.length && this.hoverMoveActions?.length) {
      throw new Error(
        'DotsEventsDirective: [hoverActions] and [hoverMoveActions] cannot be used at the same time.'
      );
    }

    if (this.hoverActions?.length) {
      listeners['pointerenter'] = (e: PointerEvent, el: Element) =>
        this.onEnter(e, el);
      listeners['pointerleave'] = (e: PointerEvent, el: Element) =>
        this.onLeave(e, el);
      this.events.push(EventType.Hover);
    } else if (this.hoverMoveActions?.length) {
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

  onEnter(_: PointerEvent, el: Element): void {
    this.initFromElement(el);
    if (this.isEventAllowed(EventType.Hover)) {
      this.setPositionsFromElement();
      this.runActions(this.hoverActions, (a) => a.onStart(this.asHost()));
    } else if (this.isEventAllowed(EventType.HoverMove)) {
      this.runActions(this.hoverMoveActions, (a) =>
        a.initialize(this.asHost())
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMove(event: PointerEvent, _: Element): void {
    if (this.isEventAllowed(EventType.HoverMove)) {
      this.setPositionsFromPointer(event);
      this.hoverMoveActions.forEach((action) => action.onStart(this.asHost()));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onLeave(_: PointerEvent, __: Element): void {
    if (this.isEventAllowed(EventType.Hover)) {
      this.hoverActions.forEach((action) => action.onEnd(this.asHost()));
    } else if (this.isEventAllowed(EventType.HoverMove)) {
      this.hoverMoveActions.forEach((action) => action.onEnd(this.asHost()));
    }
    this.resetDirective();
  }

  onClick(event: PointerEvent, el: Element): void {
    this.initFromElement(el);
    if (!this.preventAction.click) {
      if (this.hasEvent(EventType.Hover)) {
        this.setPositionsFromElement();
      } else {
        this.setPositionsFromPointer(event);
      }
      this.runActions(this.clickActions, (a) => a.onStart(this.asHost()));
    }
  }

  onClickRemove(): void {
    if (!this.preventAction.click) {
      this.runActions(this.clickActions, (a) => a.onEnd(this.asHost()));
      this.resetDirective();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  onInputEvent(_: any): void {
    if (this.isEventAllowed(EventType.Input)) {
      this.inputEventActions.forEach((action) => action.onStart(this.asHost()));
    }
  }

  initFromElement(el: Element): void {
    this.origin = el as SVGCircleElement;
    this.pointIndex = +el.getAttribute(this.lines.markerIndexAttr);
    this.markerDatum = select(
      el as SVGCircleElement
    ).datum() as LinesMarkerDatum;
  }

  setPositionsFromElement(): void {
    const markerRect = this.origin.getBoundingClientRect();
    this.positionX = markerRect.width / 2;
    this.positionY = markerRect.height / 2;
  }

  getInteractionOuput(type: EventType): LinesInteractionOutput<Datum> {
    const data = this.lines.getTooltipData(this.pointIndex);
    return { ...data, type };
  }

  emitInteractionOutput(output: LinesInteractionOutput<Datum>): void {
    this.interactionOutput.emit(output);
  }

  resetDirective(): void {
    this.origin = null;
    this.pointIndex = null;
    this.markerDatum = null;
    this.positionX = null;
    this.positionY = null;
  }
}
