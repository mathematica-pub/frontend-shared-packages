import { DataValue } from '../../../core/types/values';
import { EventType, HoverMoveAction } from '../../../events';
import { StackedBarsHost } from '../stacked-bars-events.directive';
import { StackedBarsInteractionOutput } from '../stacked-bars-interaction-output';

export class RefactorStackedBarsHoverMoveEmitTooltipData<
  Datum,
  TOrdinalValue extends DataValue,
> implements
    HoverMoveAction<
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
