import { DataValue } from '../../../core/types/values';
import { HoverMoveAction } from '../../../events/action';
import { StackedAreaComponent } from '../../stacked-area.component';
import { StackedAreaHoverMoveDirective } from '../stacked-area-hover-move.directive';

export class StackedAreaHoverMoveEmitTooltipData<
  Datum,
  CategoricalDomain extends DataValue,
  ChartMultipleDomain extends DataValue = string,
  TStackedAreaComponent extends StackedAreaComponent<
    Datum,
    CategoricalDomain,
    ChartMultipleDomain
  > = StackedAreaComponent<Datum, CategoricalDomain, ChartMultipleDomain>,
> implements
    HoverMoveAction<
      StackedAreaHoverMoveDirective<
        Datum,
        CategoricalDomain,
        ChartMultipleDomain,
        TStackedAreaComponent
      >
    >
{
  onStart(
    directive: StackedAreaHoverMoveDirective<
      Datum,
      CategoricalDomain,
      ChartMultipleDomain,
      TStackedAreaComponent
    >
  ): void {
    const tooltipData = directive.getTooltipData();
    directive.eventOutput.emit(tooltipData);
  }

  onEnd(
    event: StackedAreaHoverMoveDirective<
      Datum,
      CategoricalDomain,
      ChartMultipleDomain,
      TStackedAreaComponent
    >
  ): void {
    event.eventOutput.emit(null);
  }
}
