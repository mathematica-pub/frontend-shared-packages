import { EventType, RefactorEventAction } from '../../../events';
import { GeographiesHost } from '../geographies-events.directive';
import { GeographiesInteractionOutput } from '../geographies-interaction-output';

export class GeographiesClickEmitTooltipDataPauseOtherActions<Datum>
  implements
    RefactorEventAction<
      GeographiesHost<Datum>,
      GeographiesInteractionOutput<Datum>
    >
{
  onStart(host: GeographiesHost<Datum>): void {
    const outputData = host.getInteractionOutput(EventType.Click);
    host.disableOtherActions(EventType.Click);
    host.emitInteractionOutput(outputData);
  }

  onEnd(host: GeographiesHost<Datum>): void {
    host.resumeOtherActions(EventType.Click);
    host.emitInteractionOutput(null);
  }
}
