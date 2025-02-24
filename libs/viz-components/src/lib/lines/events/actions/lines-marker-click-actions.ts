import { select } from 'd3';

import { DataValue } from '../../../core/types/values';
import { EventAction } from '../../../events/action';
import { LinesComponent } from '../../lines.component';
import { LinesMarkerClickDirective } from '../lines-marker-click.directive';

export class LinesMarkerClickEmitTooltipData<
  Datum,
  ChartMultipleDomain extends DataValue = string,
  TLinesComponent extends LinesComponent<
    Datum,
    ChartMultipleDomain
  > = LinesComponent<Datum, ChartMultipleDomain>,
> implements
    EventAction<
      LinesMarkerClickDirective<Datum, ChartMultipleDomain, TLinesComponent>
    >
{
  onStart(
    directive: LinesMarkerClickDirective<
      Datum,
      ChartMultipleDomain,
      TLinesComponent
    >
  ) {
    const tooltipData = directive.getTooltipData();
    directive.preventHoverActions();
    select(directive.el)
      .attr('r', (): number => {
        const r =
          directive.lines.config.pointMarkers.radius +
          directive.lines.config.pointMarkers.growByOnHover;
        return r;
      })
      .raise();
    directive.eventOutput.emit(tooltipData);
  }

  onEnd(
    directive: LinesMarkerClickDirective<
      Datum,
      ChartMultipleDomain,
      TLinesComponent
    >
  ) {
    select(directive.el).attr(
      'r',
      (): number => directive.lines.config.pointMarkers.radius
    );
    directive.resumeHoverActions();
    directive.eventOutput.emit(null);
  }
}
