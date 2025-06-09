import { EventType } from '../../../events';
import { RefactorEventAction } from '../../../events/refactor-action';
import { LinesHost } from '../lines-events.directive';

export class RefactorLinesClickEmitTooltipDataPauseHoverMoveActions<Datum>
  implements RefactorEventAction<LinesHost<Datum>>
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
