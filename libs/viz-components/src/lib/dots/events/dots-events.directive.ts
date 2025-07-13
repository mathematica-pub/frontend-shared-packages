import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { select } from 'd3';
import { map, Observable } from 'rxjs';
import {
  EventAction,
  EventsDirective,
  EventType,
  HoverMoveAction,
  InputEventAction,
  MarksHost,
  UnlistenFunction,
} from '../../events';
import { DEFAULT_TOOLTIP_Y_OFFSET, TooltipPosition } from '../../tooltips';
import { DotDatum, DOTS, DotsComponent } from '../dots.component';
import { DotsInteractionOutput } from './dots-interaction-output';
import { DotsTooltipPositioner } from './dots-tooltip-positioner';

export interface DotsHost<
  Datum,
  TDotsComponent extends DotsComponent<Datum> = DotsComponent<Datum>,
> extends MarksHost<DotsInteractionOutput<Datum>, TDotsComponent> {
  getDotDatum(): DotDatum | null;
}

@Directive({
  selector: '[vicDotsEvents]',
})
export class DotsEventsDirective<
  Datum,
  TDotsComponent extends DotsComponent<Datum> = DotsComponent<Datum>,
> extends EventsDirective<DotsHost<Datum>> {
  @Input()
  hoverActions:
    | EventAction<DotsHost<Datum>, DotsInteractionOutput<Datum>>[]
    | null;
  @Input()
  hoverMoveActions:
    | HoverMoveAction<DotsHost<Datum>, DotsInteractionOutput<Datum>>[]
    | null;
  @Input()
  clickActions:
    | EventAction<DotsHost<Datum>, DotsInteractionOutput<Datum>>[]
    | null;
  @Input()
  inputEventActions: InputEventAction<
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

  getDotDatum(): DotDatum | null {
    return this.dotDatum;
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
      this.runActions(this.hoverActions, (a) => a.onStart(this));
    } else if (this.isEventAllowed(EventType.HoverMove)) {
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
    this.origin = el as SVGCircleElement;
    this.dotDatum = select(el as SVGCircleElement).datum() as DotDatum;
  }

  setPositionsFromElement(): void {
    const dotRect = this.origin.getBoundingClientRect();
    this.positionX = dotRect.width / 2;
    this.positionY = dotRect.height / 2;
  }

  getInteractionOutput(type: EventType): DotsInteractionOutput<Datum> {
    const tooltipData = this.dotDatum
      ? this.dots.getTooltipData(this.dotDatum)
      : undefined;
    const position = new DotsTooltipPositioner({
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
