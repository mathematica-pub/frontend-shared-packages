import { DataValue } from '../../../core/types/values';
import { EventType, RefactorEventAction } from '../../../events';

import { StackedBarsHost } from '../stacked-bars-events.directive';
import { StackedBarsInteractionOutput } from '../stacked-bars-interaction-output';

export class RefactorStackedBarsHoverEmitTooltipData<
  Datum,
  TOrdinalValue extends DataValue,
> implements
    RefactorEventAction<
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
