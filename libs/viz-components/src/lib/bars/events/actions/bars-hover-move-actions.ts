import { DataValue } from '../../../core/types/values';
import { HoverMoveAction } from '../../../events/action';
import { BarsHoverMoveDirective } from '../bars-hover-move.directive';

export class BarsHoverMoveEmitTooltipData<
  Datum,
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue = string,
> implements
    HoverMoveAction<
      BarsHoverMoveDirective<Datum, OrdinalDomain, ChartMultipleDomain>
    >
{
  onStart(
    directive: BarsHoverMoveDirective<Datum, OrdinalDomain, ChartMultipleDomain>
  ): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  onEnd(
    directive: BarsHoverMoveDirective<Datum, OrdinalDomain, ChartMultipleDomain>
  ): void {
    directive.eventOutput.emit(null);
  }
}
