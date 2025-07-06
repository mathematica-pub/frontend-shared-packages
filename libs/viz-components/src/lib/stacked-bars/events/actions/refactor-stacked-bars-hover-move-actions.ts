import { DataValue } from '../../../core/types/values';
import { RefactorHoverMoveAction } from '../../../events/refactor-action';
import { EventType } from '../../../events/refactor-event.directive';
import { StackedBarsHost } from '../stacked-bars-events.directive';
import { StackedBarsInteractionOutput } from '../stacked-bars-interaction-output';

export class RefactorStackedBarsHoverMoveEmitTooltipData<
  Datum,
  TOrdinalValue extends DataValue,
> implements
    RefactorHoverMoveAction<
      StackedBarsHost<Datum, TOrdinalValue>,
      StackedBarsInteractionOutput<Datum, TOrdinalValue>
    >
{
  onStart(host: StackedBarsHost<Datum, TOrdinalValue>): void {
    const tooltipData = host.getInteractionOutput(EventType.HoverMove);
    host.emitInteractionOutput(tooltipData);
  }

  onEnd(host: StackedBarsHost<Datum, TOrdinalValue>): void {
    host.emitInteractionOutput(null);
  }
}
