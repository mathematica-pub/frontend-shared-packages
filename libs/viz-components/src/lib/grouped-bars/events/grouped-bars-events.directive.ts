import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { select } from 'd3';
import { map, Observable } from 'rxjs';
import { BarDatum, BARS, BarsHost, BarsInteractionOutput } from '../../bars';
import { BarsTooltipPositioner } from '../../bars/events/bars-tooltip-positioner';
import { DataValue } from '../../core';
import {
  EventAction,
  EventsDirective,
  EventType,
  HoverMoveAction,
  InputEventAction,
  UnlistenFunction,
} from '../../events';
import { DEFAULT_TOOLTIP_Y_OFFSET, TooltipPosition } from '../../tooltips';
import { GroupedBarsComponent } from '../grouped-bars.component';

@Directive({
  selector: '[vicGroupedBarsEvents]',
})
export class GroupedBarsEventsDirective<
    Datum,
    TOrdinalValue extends DataValue,
    TGroupedBarsComponent extends GroupedBarsComponent<
      Datum,
      TOrdinalValue
    > = GroupedBarsComponent<Datum, TOrdinalValue>,
  >
  extends EventsDirective<BarsHost<Datum, TOrdinalValue>>
  implements BarsHost<Datum, TOrdinalValue>
{
  @Input()
  hoverActions:
    | EventAction<
        BarsHost<Datum, TOrdinalValue>,
        BarsInteractionOutput<Datum>
      >[]
    | null;
  @Input()
  hoverMoveActions:
    | HoverMoveAction<
        BarsHost<Datum, TOrdinalValue>,
        BarsInteractionOutput<Datum>
      >[]
    | null;
  @Input()
  clickActions:
    | EventAction<
        BarsHost<Datum, TOrdinalValue>,
        BarsInteractionOutput<Datum>
      >[]
    | null;
  @Input()
  inputEventActions: InputEventAction<
    BarsHost<Datum, TOrdinalValue>,
    BarsInteractionOutput<Datum>
  >[];
  @Output() interactionOutput =
    new EventEmitter<BarsInteractionOutput<Datum> | null>();

  barDatum: BarDatum<TOrdinalValue>;
  origin: SVGRectElement;

  constructor(@Inject(BARS) public bars: TGroupedBarsComponent) {
    super();
  }

  get marks(): GroupedBarsComponent<Datum, TOrdinalValue> {
    return this.bars;
  }

  getElements(): Observable<Element[]> {
    return this.bars.bars$.pipe(map((sel) => sel.nodes()));
  }

  getBarDatum(): BarDatum<TOrdinalValue> | null {
    return this.barDatum ?? null;
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
    this.barDatum = select(
      el as SVGRectElement
    ).datum() as BarDatum<TOrdinalValue>;
  }

  setPositionsFromElement(): void {
    const barRect = this.origin.getBoundingClientRect();
    this.positionX = barRect.width / 2;
    this.positionY = barRect.height / 2;
  }

  getInteractionOutput(type: EventType): BarsInteractionOutput<Datum> {
    const datum = this.bars.getSourceDatumFromBarDatum(this.barDatum);
    const tooltipData = datum ? this.bars.getTooltipData(datum) : undefined;
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

  emitInteractionOutput(output: BarsInteractionOutput<Datum> | null): void {
    this.interactionOutput.emit(output);
  }

  private resetDirective(): void {
    this.barDatum = undefined;
    this.origin = undefined;
    this.positionX = undefined;
    this.positionY = undefined;
  }
}
