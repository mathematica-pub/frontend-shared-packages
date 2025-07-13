import { BarsInteractionOutput } from '../../../bars';
import { DataValue } from '../../../core/types/values';
import { EventAction, EventType } from '../../../events';

import { StackedBarsHost } from '../stacked-bars-events.directive';

export class StackedBarsHoverEmitTooltipData<
  Datum,
  TOrdinalValue extends DataValue,
> implements
    EventAction<
      StackedBarsHost<Datum, TOrdinalValue>,
      BarsInteractionOutput<Datum>
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
