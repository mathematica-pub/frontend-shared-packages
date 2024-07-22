import { select } from 'd3';
import { EventEffect } from '../../../events/effect';
import { LinesComponent } from '../../lines.component';
import { LinesMarkerClickDirective } from '../lines-marker-click.directive';

export class LinesMarkerClickEmitTooltipData<
  Datum,
  ExtendedLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>
> implements
    EventEffect<LinesMarkerClickDirective<Datum, ExtendedLinesComponent>>
{
  applyEffect(
    directive: LinesMarkerClickDirective<Datum, ExtendedLinesComponent>
  ) {
    const tooltipData = directive.getTooltipData();
    directive.preventHoverEffects();
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

  removeEffect(
    directive: LinesMarkerClickDirective<Datum, ExtendedLinesComponent>
  ) {
    select(directive.el).attr(
      'r',
      (): number => directive.lines.config.pointMarkers.radius
    );
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}
