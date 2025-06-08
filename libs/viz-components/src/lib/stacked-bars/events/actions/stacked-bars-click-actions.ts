import { DataValue } from '../../../core/types/values';
import { EventAction } from '../../../events/action';
import { StackedBarsClickDirective } from '../stacked-bars-click.directive';

export class StackedBarsClickEmitTooltipDataPauseHoverMoveActions<
  Datum,
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue = string,
> implements
    EventAction<
      StackedBarsClickDirective<Datum, OrdinalDomain, ChartMultipleDomain>
    >
{
  onStart(
    directive: StackedBarsClickDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain
    >
  ) {
    const outputData = directive.getEventOutput();
    directive.disableHoverActions();
    directive.eventOutput.emit(outputData);
  }

  onEnd(
    directive: StackedBarsClickDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain
    >
  ) {
    directive.resumeHoverActions();
    directive.eventOutput.emit(null);
  }
}
