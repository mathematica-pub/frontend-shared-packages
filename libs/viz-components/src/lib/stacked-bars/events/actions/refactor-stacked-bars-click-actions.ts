import { DataValue } from '../../../core/types/values';
import { EventType, RefactorEventAction } from '../../../events';
import { StackedBarsHost } from '../stacked-bars-events.directive';
import { StackedBarsInteractionOutput } from '../stacked-bars-interaction-output';

export class RefactorStackedBarsClickEmitTooltipDataPauseOtherActions<
  Datum,
  TOrdinalValue extends DataValue,
> implements
    RefactorEventAction<
      StackedBarsHost<Datum, TOrdinalValue>,
      StackedBarsInteractionOutput<Datum, TOrdinalValue>
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
