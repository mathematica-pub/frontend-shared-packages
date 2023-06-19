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
      .attr('r', (d: any): number => {
        let r =
          typeof directive.lines.config.pointMarker.radius === 'function'
            ? directive.lines.config.pointMarker.radius(
                directive.lines.config.data[d.index]
              )
            : directive.lines.config.pointMarker.radius;
        r += this.config.growMarkerDimension;
        return r;
      })
      .raise();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: LinesMarkerClickEventDirective) {
    select(directive.el).attr('r', (d: any): number => {
      const r =
        typeof directive.lines.config.pointMarker.radius === 'function'
          ? directive.lines.config.pointMarker.radius(
              directive.lines.config.data[d.index]
            )
          : directive.lines.config.pointMarker.radius;
      return r;
    });
    directive.restartOtherEffects();
    directive.eventOutput.emit(null);
  }
}
