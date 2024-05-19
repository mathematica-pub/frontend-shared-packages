import { select } from 'd3';
import { EventEffect } from '../events/effect';
import { LinesMarkerClickDirective } from './lines-marker-click.directive';
import { LinesComponent } from './lines.component';

export class LinesMarkerClickDefaultStylesConfig {
  growMarkerDimension: number;

  constructor(options?: Partial<LinesMarkerClickDefaultStylesConfig>) {
    this.growMarkerDimension = 2;
    Object.assign(this, options);
  }
}

export class LinesMarkerClickEmitTooltipData<
  Datum,
  ExtendedLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>
> implements
    EventEffect<LinesMarkerClickDirective<Datum, ExtendedLinesComponent>>
{
  constructor(private config?: LinesMarkerClickDefaultStylesConfig) {
    this.config = config ?? new LinesMarkerClickDefaultStylesConfig();
  }

  applyEffect(
    directive: LinesMarkerClickDirective<Datum, ExtendedLinesComponent>
  ) {
    const tooltipData = directive.getTooltipData();
    directive.preventHoverEffects();
    select(directive.el)
      .attr('r', (d): number => {
        const r =
          directive.lines.config.pointMarkers.radius +
          this.config.growMarkerDimension;
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
      (d): number => directive.lines.config.pointMarkers.radius
    );
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}
