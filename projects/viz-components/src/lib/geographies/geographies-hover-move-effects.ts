import { HoverMoveEventEffect } from '../events/effect';
import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';
import { GeographiesComponent } from './geographies.component';

export class GeographiesHoverMoveEmitTooltipData<
  T,
  U extends GeographiesComponent<T> = GeographiesComponent<T>
> implements HoverMoveEventEffect<GeographiesHoverMoveDirective<T, U>>
{
  applyEffect(directive: GeographiesHoverMoveDirective<T, U>): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: GeographiesHoverMoveDirective<T, U>): void {
    directive.eventOutput.emit(null);
  }
}
