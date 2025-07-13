import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { pointer, select } from 'd3';
import { map, Observable } from 'rxjs';
import { BarsTooltipPositioner } from '../../bars/events/bars-tooltip-positioner';
import { DataValue } from '../../core/types/values';
import { EventsDirective, TooltipPosition } from '../../events';
import {
  EventAction,
  EventType,
  HoverMoveAction,
  InputEventAction,
  MarksHost,
  UnlistenFunction,
} from '../../events/events.types';
import { DEFAULT_TOOLTIP_Y_OFFSET } from '../../tooltips';
import {
  StackDatum,
  STACKED_BARS,
  StackedBarsComponent,
} from '../stacked-bars.component';
import { StackedBarsInteractionOutput } from './stacked-bars-interaction-output';

export interface StackedBarsHost<
  Datum,
  TOrdinalValue extends DataValue,
  TStackedBarsComponent extends StackedBarsComponent<
    Datum,
    TOrdinalValue
  > = StackedBarsComponent<Datum, TOrdinalValue>,
> extends MarksHost<
    StackedBarsInteractionOutput<Datum, TOrdinalValue>,
    TStackedBarsComponent
  > {
  getStackDatum(): StackDatum | null;
}

@Directive({
  selector: '[vicStackedBarsEvents]',
})
export class StackedBarsEventsDirective<
  Datum,
  TOrdinalValue extends DataValue,
  TStackedBarsComponent extends StackedBarsComponent<
    Datum,
    TOrdinalValue
  > = StackedBarsComponent<Datum, TOrdinalValue>,
> extends EventsDirective<StackedBarsHost<Datum, TOrdinalValue>> {
  @Input()
  hoverActions:
    | EventAction<
        StackedBarsHost<Datum, TOrdinalValue>,
        StackedBarsInteractionOutput<Datum, TOrdinalValue>
      >[]
    | null;
  @Input()
  hoverMoveActions:
    | HoverMoveAction<
        StackedBarsHost<Datum, TOrdinalValue>,
        StackedBarsInteractionOutput<Datum, TOrdinalValue>
      >[]
    | null;
  @Input()
  clickActions:
    | EventAction<
        StackedBarsHost<Datum, TOrdinalValue>,
        StackedBarsInteractionOutput<Datum, TOrdinalValue>
      >[]
    | null;
  @Input()
  inputEventActions: InputEventAction<
    StackedBarsHost<Datum, TOrdinalValue>,
    StackedBarsInteractionOutput<Datum, TOrdinalValue>
  >[];
  @Output() interactionOutput = new EventEmitter<StackedBarsInteractionOutput<
    Datum,
    TOrdinalValue
  > | null>();

  stackDatum: StackDatum | null = null;
  origin: SVGRectElement;

  constructor(@Inject(STACKED_BARS) public stackedBars: TStackedBarsComponent) {
    super();
  }

  get marks(): StackedBarsComponent<Datum, TOrdinalValue> {
    return this.stackedBars;
  }

  getElements(): Observable<Element[]> {
    return this.stackedBars.bars$.pipe(map((sel) => sel.nodes()));
  }

  getStackDatum(): StackDatum | null {
    return this.stackDatum ?? null;
  }

  setupListeners(elements: Element[]): UnlistenFunction[] {
    if (this.inputEventActions?.length && this.inputEvent$) {
      this.events.push(EventType.Input);
    }

    return this.bindEventListeners(
      elements,
      this.buildInteractionListeners({
        hover: this.hoverActions?.length && {
          pointerenter: (e, el) => this.onEnter(e, el),
          pointerleave: (e, el) => this.onLeave(e, el),
        },
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

  onEnter(_: PointerEvent, el: Element): void {
    this.initFromElement(el);
    if (this.isEventAllowed(EventType.Hover)) {
      this.setPositionsFromElement();
      this.runActions(this.hoverActions, (a) => a.onStart(this.asHost()));
    } else if (this.isEventAllowed(EventType.HoverMove)) {
      this.runActions(this.hoverMoveActions, (a) => {
        if (a.initialize) {
          a.initialize(this.asHost());
        }
      });
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

  initFromElement(el: Element): void {
    this.origin = el as SVGRectElement;
    this.stackDatum = select(el as SVGRectElement).datum() as StackDatum;
  }

  setPositionsFromElement(): void {
    const barRect = this.origin.getBoundingClientRect();
    this.positionX = barRect.width / 2;
    this.positionY = barRect.height / 2;
  }

  override setPositionsFromPointer(event: PointerEvent): void {
    const [positionX, positionY] = pointer(event);
    this.positionX =
      positionX - parseFloat(this.origin.getAttribute('x') || '0');
    this.positionY =
      positionY - parseFloat(this.origin.getAttribute('y') || '0');
  }

  getInteractionOutput(
    type: EventType
  ): StackedBarsInteractionOutput<Datum, TOrdinalValue> {
    const datum = this.stackedBars.getSourceDatumFromStackedBarDatum(
      this.stackDatum
    );
    const tooltipData = this.stackedBars.getTooltipData(datum);
    const position = new BarsTooltipPositioner({
      x: this.positionX,
      y: this.positionY,
    });

    return {
      ...tooltipData,
      origin: this.origin,
      anchor: {
        x: this.positionX,
        y: this.positionY,
      },
      defaultPosition: position.fromAnchor({
        x: 0,
        y: DEFAULT_TOOLTIP_Y_OFFSET,
      }),
      fromAnchor: (offset?: Partial<{ x: number; y: number }>) => {
        return position.fromAnchor({
          x: offset?.x ?? 0,
          y: offset?.y ?? DEFAULT_TOOLTIP_Y_OFFSET,
        });
      },
      customPosition: (positions: TooltipPosition[]) => {
        return position.customPosition(positions);
      },
      type,
    };
  }

  emitInteractionOutput(
    output: StackedBarsInteractionOutput<Datum, TOrdinalValue> | null
  ): void {
    this.interactionOutput.emit(output);
  }

  private resetDirective(): void {
    this.stackDatum = undefined;
    this.origin = undefined;
    this.positionX = undefined;
    this.positionY = undefined;
  }
}
