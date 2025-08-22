import { BarsInteractionOutput } from '../../../bars';
import { DataValue } from '../../../core/types/values';
import { EventAction, EventType } from '../../../events';
import { StackedBarsHost } from '../stacked-bars-events.directive';

export class StackedBarsClickEmitTooltipDataPauseOtherActions<
  Datum,
  TOrdinalValue extends DataValue,
> implements
    EventAction<
      StackedBarsHost<Datum, TOrdinalValue>,
      BarsInteractionOutput<Datum>
    >
{
  onStart(host: StackedBarsHost<Datum, TOrdinalValue>) {
    const outputData = host.getInteractionOutput(EventType.Click);
    host.disableOtherActions(EventType.Click);
    host.emitInteractionOutput(outputData);
  }

  onEnd(host: StackedBarsHost<Datum, TOrdinalValue>) {
    host.resumeOtherActions(EventType.Click);
    host.emitInteractionOutput(null);
  }
}
