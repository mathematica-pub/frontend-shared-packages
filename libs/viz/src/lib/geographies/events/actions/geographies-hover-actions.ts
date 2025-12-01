import { EventAction, EventType } from '../../../events';
import { GeographiesHost } from '../geographies-events.directive';
import { GeographiesInteractionOutput } from '../geographies-interaction-output';

export class GeographiesHoverEmitTooltipData<Datum>
  implements
    EventAction<GeographiesHost<Datum>, GeographiesInteractionOutput<Datum>>
{
  onStart(host: GeographiesHost<Datum>): void {
    const outputData = host.getInteractionOutput(EventType.Hover);
    host.emitInteractionOutput(outputData);
  }

  onEnd(host: GeographiesHost<Datum>): void {
    host.emitInteractionOutput(null);
  }
}
