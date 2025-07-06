import { DataValue } from '../../../core/types/values';
import { EventType, RefactorHoverMoveAction } from '../../../events';
import { StackedAreaHost } from '../stacked-area-events.directive';

export class StackedAreaHoverMoveEmitTooltipData<
  Datum,
  TCategoricalValue extends DataValue,
> implements RefactorHoverMoveAction<StackedAreaHost<Datum, TCategoricalValue>>
{
  onStart(host: StackedAreaHost<Datum, TCategoricalValue>): void {
    const tooltipData = host.getInteractionOutput(EventType.HoverMove);
    host.emitInteractionOutput(tooltipData);
  }

  onEnd(host: StackedAreaHost<Datum, TCategoricalValue>): void {
    host.emitInteractionOutput(null);
  }
}
