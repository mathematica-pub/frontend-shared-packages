import { EventEffect } from '../events/effect';
import { GeographiesHoverAndMoveEventDirective } from './geographies-hover-move-event.directive';

export class GeographiesHoverAndMoveEffectEmitTooltipData
  implements EventEffect<GeographiesHoverAndMoveEventDirective>
{
  applyEffect(directive: GeographiesHoverAndMoveEventDirective): void {
    const tooltipData = directive.getTooltipData();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: GeographiesHoverAndMoveEventDirective): void {
    directive.eventOutput.emit(null);
  }
}
