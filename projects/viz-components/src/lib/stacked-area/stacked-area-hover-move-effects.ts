import { EventEffect } from '../events/effect';
import { StackedAreaHoverAndMoveEventDirective } from './stacked-area-hover-move-event.directive';

export class EmitStackedAreaTooltipData
  implements EventEffect<StackedAreaHoverAndMoveEventDirective>
{
  applyEffect(directive: StackedAreaHoverAndMoveEventDirective): void {
    const tooltipData = directive.getTooltipData();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(event: StackedAreaHoverAndMoveEventDirective): void {
    event.eventOutput.emit(null);
  }
}
