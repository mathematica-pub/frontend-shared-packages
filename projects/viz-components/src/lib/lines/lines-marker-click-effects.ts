import { select } from 'd3';
import { EventEffect } from '../events/effect';
import { LinesMarkerClickDirective } from './lines-marker-click.directive';

export class LinesMarkerClickDefaultStylesConfig {
  growMarkerDimension: number;

  constructor(init?: Partial<LinesMarkerClickDefaultStylesConfig>) {
    this.growMarkerDimension = 2;
    Object.assign(this, init);
  }
}

export class LinesMarkerClickEmitTooltipData
  implements EventEffect<LinesMarkerClickDirective>
{
  constructor(private config?: LinesMarkerClickDefaultStylesConfig) {
    this.config = config ?? new LinesMarkerClickDefaultStylesConfig();
  }

  applyEffect(directive: LinesMarkerClickDirective) {
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

  removeEffect(directive: LinesMarkerClickDirective) {
    select(directive.el).attr(
      'r',
      (d): number => directive.lines.config.pointMarkers.radius
    );
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}
