import { DataValue } from '../../../core/types/values';
import { RefactorHoverMoveAction } from '../../../events/refactor-action';
import { EventType } from '../../../events/refactor-event.directive';
import { BarsHost } from '../bars-events.directive';
import { BarsInteractionOutput } from '../bars-interaction-output';

export class RefactorBarsHoverMoveEmitTooltipData<
  Datum,
  TOrdinalValue extends DataValue,
> implements
    RefactorHoverMoveAction<
      BarsHost<Datum, TOrdinalValue>,
      BarsInteractionOutput<Datum, TOrdinalValue>
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
