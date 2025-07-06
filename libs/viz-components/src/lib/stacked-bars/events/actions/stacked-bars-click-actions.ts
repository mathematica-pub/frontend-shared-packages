import { DataValue } from '../../../core/types/values';
import { EventAction, EventType } from '../../../events';
import { StackedBarsHost } from '../stacked-bars-events.directive';
import { StackedBarsInteractionOutput } from '../stacked-bars-interaction-output';

export class StackedBarsClickEmitTooltipDataPauseOtherActions<
  Datum,
  TOrdinalValue extends DataValue,
> implements
    EventAction<
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
