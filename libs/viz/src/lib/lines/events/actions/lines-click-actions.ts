import { EventAction, EventType } from '../../../events';
import { LinesHost } from '../lines-events.directive';

export class LinesClickEmitTooltipDataPauseHoverMoveActions<Datum>
  implements EventAction<LinesHost<Datum>>
{
  onStart(host: LinesHost<Datum>) {
    const outputData = host.getInteractionOutput(EventType.Click);
    host.disableOtherActions(EventType.Click);
    host.emitInteractionOutput(outputData);
  }

  onEnd(host: LinesHost<Datum>) {
    host.resumeOtherActions(EventType.Click);
    host.emitInteractionOutput(null);
  }
}
