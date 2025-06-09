import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { select } from 'd3';
import { map, Observable } from 'rxjs';
import { DataValue } from '../../core/types/values';
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
import { BarDatum, BARS, BarsComponent } from '../bars.component';
import { BarsInteractionOutput } from './bars-interaction-output';

export type BarsHost<Datum, TOrdinalValue extends DataValue> = MarksHost<
  BarsInteractionOutput<Datum, TOrdinalValue>,
  BarsComponent<Datum, TOrdinalValue>
>;

@Directive({
  selector: '[vicBarsEvents]',
})
export class BarsEventsDirective<
    Datum,
    TOrdinalValue extends DataValue,
    TBarsComponent extends BarsComponent<Datum, TOrdinalValue> = BarsComponent<
      Datum,
      TOrdinalValue
    >,
  >
  extends RefactorEventDirective<BarsHost<Datum, TOrdinalValue>>
  implements BarsHost<Datum, TOrdinalValue>
{
  @Input()
  hoverActions:
    | RefactorEventAction<
        BarsHost<Datum, TOrdinalValue>,
        BarsInteractionOutput<Datum, TOrdinalValue>
      >[]
    | null;
  @Input()
  hoverMoveActions:
    | RefactorHoverMoveAction<
        BarsHost<Datum, TOrdinalValue>,
        BarsInteractionOutput<Datum, TOrdinalValue>
      >[]
    | null;
  @Input()
  clickActions:
    | RefactorEventAction<
        BarsHost<Datum, TOrdinalValue>,
        BarsInteractionOutput<Datum, TOrdinalValue>
      >[]
    | null;
  @Input()
  inputEventActions: RefactorInputEventAction<
    BarsHost<Datum, TOrdinalValue>,
    BarsInteractionOutput<Datum, TOrdinalValue>
  >[];
  @Output() interactionOutput = new EventEmitter<BarsInteractionOutput<
    Datum,
    TOrdinalValue
  > | null>();

  barDatum: BarDatum<TOrdinalValue>;
  origin: SVGRectElement;

  constructor(@Inject(BARS) public bars: TBarsComponent) {
    super();
  }

  get marks(): BarsComponent<Datum, TOrdinalValue> {
    return this.bars;
  }

  getElements(): Observable<Element[]> {
    return this.bars.bars$.pipe(map((sel) => sel.nodes()));
  }

  setupListeners(elements: Element[]): UnlistenFunction[] {
    const listeners = {};

    if (this.hoverActions?.length && this.hoverMoveActions?.length) {
      throw new Error(
        'BarsEventsDirective: [hoverActions] and [hoverMoveActions] cannot be used at the same time.'
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
    this.origin = el as SVGRectElement;
    this.barDatum = select(
      el as SVGRectElement
    ).datum() as BarDatum<TOrdinalValue>;
  }

  setPositionsFromElement(): void {
    const barRect = this.origin.getBoundingClientRect();
    this.positionX = barRect.width / 2;
    this.positionY = barRect.height / 2;
  }

  getInteractionOutput(
    type: EventType
  ): BarsInteractionOutput<Datum, TOrdinalValue> {
    const datum = this.bars.getSourceDatumFromBarDatum(this.barDatum);
    const tooltipData = this.bars.getTooltipData(datum);

    return {
      ...tooltipData,
      origin: this.origin,
      positionX: this.positionX,
      positionY: this.positionY,
      type,
    };
  }

  emitInteractionOutput(
    output: BarsInteractionOutput<Datum, TOrdinalValue> | null
  ): void {
    this.interactionOutput.emit(output);
  }

  private resetDirective(): void {
    this.barDatum = undefined;
    this.origin = undefined;
    this.positionX = undefined;
    this.positionY = undefined;
  }
}
