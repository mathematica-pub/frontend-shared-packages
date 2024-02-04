import { HoverMoveEventEffect } from '../events/effect';
import { StackedAreaHoverMoveDirective } from './stacked-area-hover-move.directive';
import { StackedAreaComponent } from './stacked-area.component';

export class StackedAreaHoverMoveEmitTooltipData<
  T,
  U extends StackedAreaComponent<T> = StackedAreaComponent<T>
> implements HoverMoveEventEffect<StackedAreaHoverMoveDirective<T, U>>
{
  applyEffect(directive: StackedAreaHoverMoveDirective<T, U>): void {
    const tooltipData = directive.getTooltipData();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(event: StackedAreaHoverMoveDirective<T, U>): void {
    event.eventOutput.emit(null);
  }
}
