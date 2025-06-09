import { DataValue } from '../../../core/types/values';
import { EventType, RefactorEventAction } from '../../../events';
import { BarsHost } from '../bars-events.directive';
import { BarsInteractionOutput } from '../bars-interaction-output';

export class RefactorBarsClickEmitTooltipDataPauseOtherActions<
  Datum,
  TOrdinalValue extends DataValue,
> implements
    RefactorEventAction<
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
