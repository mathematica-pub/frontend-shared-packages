import { EventType, RefactorHoverMoveAction } from '../../../events';
import { GeographiesHost } from '../geographies-events.directive';
import { GeographiesInteractionOutput } from '../geographies-interaction-output';

export class RefactorGeographiesHoverMoveEmitTooltipData<Datum>
  implements
    RefactorHoverMoveAction<
      GeographiesHost<Datum>,
      GeographiesInteractionOutput<Datum>
    >
{
  onStart(host: GeographiesHost<Datum>): void {
    const outputData = host.getInteractionOutput(EventType.HoverMove);
    host.emitInteractionOutput(outputData);
  }

  onEnd(host: GeographiesHost<Datum>): void {
    host.emitInteractionOutput(null);
  }
}
