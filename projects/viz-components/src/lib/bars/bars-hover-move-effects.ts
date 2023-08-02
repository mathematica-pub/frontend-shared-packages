import { EventEffect } from '../events/effect';
import { BarsHoverMoveDirective } from './bars-hover-move.directive';

export class BarsHoverMoveEmitTooltipData
  implements EventEffect<BarsHoverMoveDirective>
{
  applyEffect(directive: BarsHoverMoveDirective): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: BarsHoverMoveDirective): void {
    directive.eventOutput.emit(null);
  }
}
