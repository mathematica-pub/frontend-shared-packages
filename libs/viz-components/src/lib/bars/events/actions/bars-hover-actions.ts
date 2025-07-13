import { DataValue } from '../../../core/types/values';
import { EventAction, EventType } from '../../../events';
import { BarsHost } from '../bars-events.directive';
import { BarsInteractionOutput } from '../bars-interaction-output';

export class BarsHoverShowLabels<Datum, TOrdinalValue extends DataValue>
  implements
    EventAction<BarsHost<Datum, TOrdinalValue>, BarsInteractionOutput<Datum>>
{
  onStart(host: BarsHost<Datum, TOrdinalValue>): void {
    host.marks.barGroups
      .filter((d) => d === host.getBarDatum().index)
      .select('text')
      .style('display', null);
  }

  onEnd(host: BarsHost<Datum, TOrdinalValue>): void {
    host.marks.barGroups
      .filter((d) => d === host.getBarDatum().index)
      .select('text')
      .style('display', 'none');
  }
}

export class BarsHoverEmitTooltipData<Datum, TOrdinalValue extends DataValue>
  implements
    EventAction<BarsHost<Datum, TOrdinalValue>, BarsInteractionOutput<Datum>>
{
  onStart(host: BarsHost<Datum, TOrdinalValue>): void {
    const tooltipData = host.getInteractionOutput(EventType.Hover);
    host.emitInteractionOutput(tooltipData);
  }

  onEnd(host: BarsHost<Datum, TOrdinalValue>): void {
    host.emitInteractionOutput(null);
  }
}
