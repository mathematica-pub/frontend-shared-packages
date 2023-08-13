import { EventEffect } from '../events/effect';
import { GeographiesClickDirective } from './geographies-click.directive';

export class GeographiesClickEmitTooltipDataPauseHoverMoveEffects
  implements EventEffect<GeographiesClickDirective>
{
  applyEffect(directive: GeographiesClickDirective) {
    const tooltipData = directive.getOutputData();
    directive.preventHoverEffects();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: GeographiesClickDirective) {
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}
