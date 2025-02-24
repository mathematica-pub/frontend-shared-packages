import { DataValue } from '../../../core/types/values';
import { EventAction } from '../../../events/action';
import { BarsClickDirective } from '../bars-click.directive';

export class BarsClickEmitTooltipDataPauseHoverMoveActions<
  Datum,
  OrdinalDomin extends DataValue,
  ChartMultipleDomain extends DataValue = string,
> implements
    EventAction<BarsClickDirective<Datum, OrdinalDomin, ChartMultipleDomain>>
{
  onStart(
    directive: BarsClickDirective<Datum, OrdinalDomin, ChartMultipleDomain>
  ) {
    const outputData = directive.getEventOutput();
    directive.disableHoverActions();
    directive.eventOutput.emit(outputData);
  }

  onEnd(
    directive: BarsClickDirective<Datum, OrdinalDomin, ChartMultipleDomain>
  ) {
    directive.resumeHoverActions();
    directive.eventOutput.emit(null);
  }
}
