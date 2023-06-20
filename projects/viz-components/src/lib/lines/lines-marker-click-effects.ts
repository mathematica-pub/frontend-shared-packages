import { select } from 'd3';
import { EventEffect } from '../events/effect';
import { LinesMarkerClickDirective } from './lines-marker-click.directive';

export class LinesMarkerClickEventDefaultStylesConfig {
  growMarkerDimension: number;

  constructor(init?: Partial<LinesMarkerClickEventDefaultStylesConfig>) {
    this.growMarkerDimension = 2;
    Object.assign(this, init);
  }
}

export class LinesMarkerClickEffectEmitTooltipData
  implements EventEffect<LinesMarkerClickDirective>
{
  constructor(private config?: LinesMarkerClickEventDefaultStylesConfig) {
    this.config = config ?? new LinesMarkerClickEventDefaultStylesConfig();
  }

  applyEffect(directive: LinesMarkerClickDirective) {
    const tooltipData = directive.getTooltipData();
    directive.preventHoverEffects();
    select(directive.el)
      .attr('r', (d): number => {
        const r =
          directive.lines.config.pointMarker.radius +
          this.config.growMarkerDimension;
        return r;
      })
      .raise();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: LinesMarkerClickDirective) {
    select(directive.el).attr(
      'r',
      (d): number => directive.lines.config.pointMarker.radius
    );
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}
