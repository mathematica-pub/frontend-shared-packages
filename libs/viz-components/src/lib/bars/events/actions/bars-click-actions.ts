import { DataValue } from '../../../core/types/values';
import { EventAction, EventType } from '../../../events';
import { BarsHost } from '../bars-events.directive';
import { BarsInteractionOutput } from '../bars-interaction-output';

export class BarsClickEmitTooltipDataPauseOtherActions<
  Datum,
  TOrdinalValue extends DataValue,
> implements
    EventAction<
      BarsHost<Datum, TOrdinalValue>,
      BarsInteractionOutput<Datum, TOrdinalValue>
    >
{
  onStart(host: BarsHost<Datum, TOrdinalValue>) {
    const outputData = host.getInteractionOutput(EventType.Click);
    host.disableOtherActions(EventType.Click);
    host.emitInteractionOutput(outputData);
  }

  onEnd(host: BarsHost<Datum, TOrdinalValue>) {
    host.resumeOtherActions(EventType.Click);
    host.emitInteractionOutput(null);
  }
}
