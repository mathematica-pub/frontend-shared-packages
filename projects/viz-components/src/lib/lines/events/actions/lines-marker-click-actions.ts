import { select } from 'd3';
import { EventAction } from '../../../events/action';
import { LinesComponent } from '../../lines.component';
import { LinesMarkerClickDirective } from '../lines-marker-click.directive';

export class LinesMarkerClickEmitTooltipData<
  Datum,
  ExtendedLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> implements
    EventAction<LinesMarkerClickDirective<Datum, ExtendedLinesComponent>>
{
  onStart(directive: LinesMarkerClickDirective<Datum, ExtendedLinesComponent>) {
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

  onEnd(directive: LinesMarkerClickDirective<Datum, ExtendedLinesComponent>) {
    select(directive.el).attr(
      'r',
      (): number => directive.lines.config.pointMarkers.radius
    );
    directive.resumeHoverActions();
    directive.eventOutput.emit(null);
  }
}
