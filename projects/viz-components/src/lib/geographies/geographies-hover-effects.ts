import { EventEffect } from '../events/effect';
import { GeographiesHoverDirective } from './geographies-hover.directive';

export class GeographiesHoverEmitTooltipData
  implements EventEffect<GeographiesHoverDirective>
{
  applyEffect(directive: GeographiesHoverDirective): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: GeographiesHoverDirective): void {
    directive.eventOutput.emit(null);
  }
}
