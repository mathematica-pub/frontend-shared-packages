import { EventAction, EventType } from '../../../events';
import { GeographiesHost } from '../geographies-events.directive';
import { GeographiesInteractionOutput } from '../geographies-interaction-output';

export class GeographiesClickEmitTooltipDataPauseOtherActions<Datum>
  implements
    EventAction<GeographiesHost<Datum>, GeographiesInteractionOutput<Datum>>
{
  onStart(host: GeographiesHost<Datum>): void {
    const output = host.getInteractionOutput(EventType.Click);
    host.disableOtherActions(EventType.Click);
    host.emitInteractionOutput(output);
  }

  onEnd(host: GeographiesHost<Datum>): void {
    host.resumeOtherActions(EventType.Click);
    host.emitInteractionOutput(null);
  }
}
