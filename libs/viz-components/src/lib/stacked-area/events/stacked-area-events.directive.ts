import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { DataValue } from '@hsi/viz-components';
import {
  EventType,
  MarksHost,
  RefactorEventAction,
  RefactorEventDirective,
  RefactorHoverMoveAction,
  RefactorInputEventAction,
  UnlistenFunction,
} from '../../events';
import { STACKED_AREA, StackedAreaComponent } from '../stacked-area.component';
import { StackedAreaInteractionOutput } from './stacked-area-interaction-output';

export type StackedAreaHost<
  Datum,
  TCategoricalValue extends DataValue,
> = MarksHost<
  StackedAreaInteractionOutput<Datum, TCategoricalValue>,
  StackedAreaComponent<Datum, TCategoricalValue>
>;

@Directive({
  selector: '[vicStackedAreaEvents]',
})
export class StackedAreaEventsDirective<
    Datum,
    TCategoricalValue extends DataValue,
    TStackedAreaComponent extends StackedAreaComponent<
      Datum,
      TCategoricalValue
    > = StackedAreaComponent<Datum, TCategoricalValue>,
  >
  extends RefactorEventDirective<StackedAreaHost<Datum, TCategoricalValue>>
  implements StackedAreaHost<Datum, TCategoricalValue>
{
  @Input()
  hoverActions:
    | RefactorEventAction<
        StackedAreaHost<Datum, TCategoricalValue>,
        StackedAreaInteractionOutput<Datum, TCategoricalValue>
      >[]
    | null;
  @Input()
  hoverMoveActions:
    | RefactorHoverMoveAction<
        StackedAreaHost<Datum, TCategoricalValue>,
        StackedAreaInteractionOutput<Datum, TCategoricalValue>
      >[]
    | null;
  @Input()
  clickActions:
    | RefactorEventAction<
        StackedAreaHost<Datum, TCategoricalValue>,
        StackedAreaInteractionOutput<Datum, TCategoricalValue>
      >[]
    | null;
  @Input()
  inputEventActions: RefactorInputEventAction<
    StackedAreaHost<Datum, TCategoricalValue>,
    StackedAreaInteractionOutput<Datum, TCategoricalValue>
  >[];
  @Output() interactionOutput = new EventEmitter<StackedAreaInteractionOutput<
    Datum,
    TCategoricalValue
  > | null>();

  constructor(
    @Inject(STACKED_AREA) public stackedAreas: TStackedAreaComponent
  ) {
    super();
  }

  get marks(): StackedAreaComponent<Datum, TCategoricalValue> {
    return this.stackedAreas;
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

  getInteractionOutput(
    type: EventType
  ): StackedAreaInteractionOutput<Datum, TCategoricalValue> {
    throw new Error('Method not implemented.');
  }
  emitInteractionOutput(
    output: StackedAreaInteractionOutput<Datum, TCategoricalValue>
  ): void {
    throw new Error('Method not implemented.');
  }
}
