import { HoverMoveEventEffect } from '../events/effect';
import { BarsHoverMoveDirective } from './bars-hover-move.directive';

export class BarsHoverMoveEmitTooltipData<T>
  implements HoverMoveEventEffect<BarsHoverMoveDirective<T>>
{
  applyEffect(directive: BarsHoverMoveDirective<T>): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: BarsHoverMoveDirective<T>): void {
    directive.eventOutput.emit(null);
  }
}
