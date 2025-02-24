import { DataValue } from '../../../core/types/values';
import { EventAction } from '../../../events/action';
import { LinesComponent } from '../../lines.component';
import { LinesClickDirective } from '../lines-click.directive';

export class LinesClickEmitTooltipDataPauseHoverMoveActions<
  Datum,
  ChartMultipleDomain extends DataValue = string,
  TLinesComponent extends LinesComponent<
    Datum,
    ChartMultipleDomain
  > = LinesComponent<Datum, ChartMultipleDomain>,
> implements
    EventAction<
      LinesClickDirective<Datum, ChartMultipleDomain, TLinesComponent>
    >
{
  onStart(
    directive: LinesClickDirective<Datum, ChartMultipleDomain, TLinesComponent>
  ) {
    const outputData = directive.getOutputData();
    directive.preventHoverActions();
    directive.eventOutput.emit(outputData);
  }

  onEnd(
    directive: LinesClickDirective<Datum, ChartMultipleDomain, TLinesComponent>
  ) {
    directive.resumeHoverActions();
    directive.eventOutput.emit(null);
  }
}
