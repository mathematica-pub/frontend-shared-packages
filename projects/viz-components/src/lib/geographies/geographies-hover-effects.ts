import { EventEffect } from '../events/effect';
import { GeographiesHoverEventDirective } from './geographies-hover-event.directive';

export class GeographiesHoverEffectEmitTooltipData
  implements EventEffect<GeographiesHoverEventDirective>
{
  applyEffect(directive: GeographiesHoverEventDirective): void {
    const tooltipData = directive.getTooltipData();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: GeographiesHoverEventDirective): void {
    directive.eventOutput.emit(null);
  }
}
