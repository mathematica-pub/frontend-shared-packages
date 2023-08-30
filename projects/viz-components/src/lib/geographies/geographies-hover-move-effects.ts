import { HoverMoveEventEffect } from '../events/effect';
import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';

export class GeographiesHoverMoveEmitTooltipData
  implements HoverMoveEventEffect<GeographiesHoverMoveDirective>
{
  applyEffect(directive: GeographiesHoverMoveDirective): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: GeographiesHoverMoveDirective): void {
    directive.eventOutput.emit(null);
  }
}
