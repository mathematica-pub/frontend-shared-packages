import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { select } from 'd3';
import { map, Observable } from 'rxjs';
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
import { DotDatum, DOTS, DotsComponent } from '../dots.component';
import { DotsInteractionOutput } from './dots-interaction-output';

type DotsHost<Datum> = MarksHost<
  DotsInteractionOutput<Datum>,
  DotsComponent<Datum>
>;

@Directive({
  selector: '[vicDotsEvents]',
})
export class DotsEventsDirective<
  Datum,
  TDotsComponent extends DotsComponent<Datum> = DotsComponent<Datum>,
> extends RefactorEventDirective<DotsHost<Datum>> {
  @Input()
  hoverActions:
    | RefactorEventAction<DotsHost<Datum>, DotsInteractionOutput<Datum>>[]
    | null;
  @Input()
  hoverMoveActions:
    | RefactorHoverMoveAction<DotsHost<Datum>, DotsInteractionOutput<Datum>>[]
    | null;
  @Input()
  clickActions:
    | RefactorEventAction<DotsHost<Datum>, DotsInteractionOutput<Datum>>[]
    | null;
  @Input()
  inputEventActions: RefactorInputEventAction<
    DotsHost<Datum>,
    DotsInteractionOutput<Datum>
  >[];
  @Output() interactionOutput = new EventEmitter<
    DotsInteractionOutput<Datum>
  >();

  dotDatum: DotDatum;
  origin: SVGCircleElement;

  constructor(@Inject(DOTS) public dots: TDotsComponent) {
    super();
  }

  get marks(): DotsComponent<Datum> {
    return this.dots;
  }

  getElements(): Observable<Element[]> {
    return this.dots.dots$.pipe(map((sel) => sel.nodes()));
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

  onEnter(event: PointerEvent, el: Element): void {
    this.initFromElement(el);
    if (this.isEventAllowed(EventType.Hover)) {
      this.setPositionsFromElement();
      this.runActions(this.hoverActions, (a) => a.onStart(this));
    } else if (this.isEventAllowed(EventType.HoverMove)) {
      this.runActions(this.hoverMoveActions, (a) => a.initialize(this));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMove(event: PointerEvent, _: Element): void {
    if (this.isEventAllowed(EventType.HoverMove)) {
      this.setPositionsFromPointer(event);
      this.hoverMoveActions.forEach((action) => action.onStart(this));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onLeave(_: PointerEvent, __: Element): void {
    if (this.isEventAllowed(EventType.Hover)) {
      this.hoverActions.forEach((action) => action.onEnd(this));
    } else if (this.isEventAllowed(EventType.HoverMove)) {
      this.hoverMoveActions.forEach((action) => action.onEnd(this));
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
      this.runActions(this.clickActions, (a) => a.onStart(this));
    }
  }

  onClickRemove(): void {
    if (!this.preventAction.click) {
      this.runActions(this.clickActions, (a) => a.onEnd(this));
      this.resetDirective();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  onInputEvent(_: any): void {
    if (this.isEventAllowed(EventType.Input)) {
      this.inputEventActions.forEach((action) => action.onStart(this));
    }
  }

  initFromElement(el: Element): void {
    this.origin = el as SVGCircleElement;
    this.dotDatum = select(el as SVGCircleElement).datum() as DotDatum;
  }

  setPositionsFromElement(): void {
    const dotRect = this.origin.getBoundingClientRect();
    this.positionX = dotRect.width / 2;
    this.positionY = dotRect.height / 2;
  }

  getInteractionOutput(type: EventType): DotsInteractionOutput<Datum> {
    const tooltipData = this.dots.getTooltipData(this.dotDatum);

    return {
      ...tooltipData,
      origin: this.origin,
      positionX: this.positionX,
      positionY: this.positionY,
      type,
    };
  }

  emitInteractionOutput(output: DotsInteractionOutput<Datum>): void {
    this.interactionOutput.emit(output);
  }

  private resetDirective(): void {
    this.dotDatum = undefined;
    this.origin = undefined;
    this.positionX = undefined;
    this.positionY = undefined;
  }
}
