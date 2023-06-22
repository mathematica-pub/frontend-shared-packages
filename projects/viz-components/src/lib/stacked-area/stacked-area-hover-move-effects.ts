import { EventEffect } from '../events/effect';
import { StackedAreaHoverMoveDirective } from './stacked-area-hover-move-event.directive';

export class StackedAreaHoverMoveEmitTooltipData
  implements EventEffect<StackedAreaHoverMoveDirective>
{
  applyEffect(directive: StackedAreaHoverMoveDirective): void {
    const tooltipData = directive.getTooltipData();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(event: StackedAreaHoverMoveDirective): void {
    event.eventOutput.emit(null);
  }
}
