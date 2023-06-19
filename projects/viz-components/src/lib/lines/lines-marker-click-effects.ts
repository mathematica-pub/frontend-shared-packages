import { select } from 'd3';
import { EventEffect } from '../events/effect';
import { LinesMarkerClickEventDirective } from './lines-marker-click-event.directive';

export class LinesMarkerClickEventDefaultStylesConfig {
  growMarkerDimension: number;

  constructor(init?: Partial<LinesMarkerClickEventDefaultStylesConfig>) {
    this.growMarkerDimension = 2;
    Object.assign(this, init);
  }
}

export class LinesMarkerClickEffectEmitTooltipData
  implements EventEffect<LinesMarkerClickEventDirective>
{
  constructor(private config?: LinesMarkerClickEventDefaultStylesConfig) {
    this.config = config ?? new LinesMarkerClickEventDefaultStylesConfig();
  }

  applyEffect(directive: LinesMarkerClickEventDirective) {
    const tooltipData = directive.getTooltipData();
    directive.preventOtherEffects();
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

  removeEffect(directive: LinesMarkerClickEventDirective) {
    select(directive.el).attr(
      'r',
      (d): number => directive.lines.config.pointMarker.radius
    );
    directive.restartOtherEffects();
    directive.eventOutput.emit(null);
  }
}
