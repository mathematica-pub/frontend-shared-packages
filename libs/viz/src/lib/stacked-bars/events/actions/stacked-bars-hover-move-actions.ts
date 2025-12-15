import { BarsInteractionOutput } from '../../../bars';
import { DataValue } from '../../../core/types/values';
import { EventType, HoverMoveAction } from '../../../events';
import { StackedBarsHost } from '../stacked-bars-events.directive';

export class StackedBarsHoverMoveEmitTooltipData<
  Datum,
  TOrdinalValue extends DataValue,
> implements
    HoverMoveAction<
      StackedBarsHost<Datum, TOrdinalValue>,
      BarsInteractionOutput<Datum>
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
