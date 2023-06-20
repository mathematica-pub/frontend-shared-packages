import { EventEffect } from '../events/effect';
import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';

export class GeographiesHoverMoveEmitTooltipData
  implements EventEffect<GeographiesHoverMoveDirective>
{
  applyEffect(directive: GeographiesHoverMoveDirective): void {
    const tooltipData = directive.getTooltipData();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: GeographiesHoverMoveDirective): void {
    directive.eventOutput.emit(null);
  }
}
