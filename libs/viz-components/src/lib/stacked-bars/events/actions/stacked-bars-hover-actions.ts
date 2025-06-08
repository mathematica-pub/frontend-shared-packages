import { DataValue } from '../../../core/types/values';
import { EventAction } from '../../../events/action';
import { StackedBarsHoverDirective } from '../stacked-bars-hover.directive';
export class StackedBarsHoverEmitTooltipData<
  Datum,
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue = string,
> implements
    EventAction<
      StackedBarsHoverDirective<Datum, OrdinalDomain, ChartMultipleDomain>
    >
{
  onStart(
    directive: StackedBarsHoverDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain
    >
  ): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  onEnd(
    directive: StackedBarsHoverDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain
    >
  ): void {
    directive.eventOutput.emit(null);
  }
}
