import { DataValue } from '../../../core/types/values';
import { EventAction, EventType } from '../../../events';

import { StackedBarsHost } from '../stacked-bars-events.directive';
import { StackedBarsInteractionOutput } from '../stacked-bars-interaction-output';

export class StackedBarsHoverEmitTooltipData<
  Datum,
  TOrdinalValue extends DataValue,
> implements
    EventAction<
      StackedBarsHost<Datum, TOrdinalValue>,
      StackedBarsInteractionOutput<Datum, TOrdinalValue>
    >
{
  onStart(host: StackedBarsHost<Datum, TOrdinalValue>): void {
    const tooltipData = host.getInteractionOutput(EventType.Hover);
    host.emitInteractionOutput(tooltipData);
  }

  onEnd(host: StackedBarsHost<Datum, TOrdinalValue>): void {
    host.emitInteractionOutput(null);
  }
}
