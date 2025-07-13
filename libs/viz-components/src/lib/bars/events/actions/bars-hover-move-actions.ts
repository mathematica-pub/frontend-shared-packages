import { DataValue } from '../../../core/types/values';
import { EventType, HoverMoveAction } from '../../../events';
import { BarsHost } from '../bars-events.directive';
import { BarsInteractionOutput } from '../bars-interaction-output';

export class BarsHoverMoveEmitTooltipData<
  Datum,
  TOrdinalValue extends DataValue,
> implements
    HoverMoveAction<
      BarsHost<Datum, TOrdinalValue>,
      BarsInteractionOutput<Datum>
    >
{
  onStart(host: BarsHost<Datum, TOrdinalValue>): void {
    const tooltipData = host.getInteractionOutput(EventType.HoverMove);
    host.emitInteractionOutput(tooltipData);
  }

  onEnd(host: BarsHost<Datum, TOrdinalValue>): void {
    host.emitInteractionOutput(null);
  }
}
