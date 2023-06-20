import { select } from 'd3';
import { EventEffect } from '../events/effect';
import { UtilitiesService } from '../core/services/utilities.service';
import { inject } from '@angular/core';
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
  private utilities = inject(UtilitiesService);

  applyEffect(directive: LinesMarkerClickDirective) {
    const tooltipData = directive.getTooltipData();
    directive.preventHoverEffects();
    select(directive.el)
      .attr('r', (d: any): number => {
        let r = this.utilities.getValueFromConstantOrFunction(
          directive.lines.config.pointMarker.radius,
          directive.lines.config.data[d.index]
        );
        r += this.config.growMarkerDimension;
        return r;
      })
      .raise();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: LinesMarkerClickDirective) {
    select(directive.el).attr('r', (d: any): number => {
      const r = this.utilities.getValueFromConstantOrFunction(
        directive.lines.config.pointMarker.radius,
        directive.lines.config.data[d.index]
      );
      return r;
    });
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}
