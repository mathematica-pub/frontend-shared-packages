import { DataValue } from '../../../core/types/values';
import { HoverMoveAction } from '../../../events/action';
import { StackedBarsHoverMoveDirective } from '../stacked-bars-hover-move.directive';

export class StackedBarsHoverMoveEmitTooltipData<
  Datum,
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue = string,
> implements
    HoverMoveAction<
      StackedBarsHoverMoveDirective<Datum, OrdinalDomain, ChartMultipleDomain>
    >
{
  onStart(
    directive: StackedBarsHoverMoveDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain
    >
  ): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  onEnd(
    directive: StackedBarsHoverMoveDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain
    >
  ): void {
    directive.eventOutput.emit(null);
  }
}
