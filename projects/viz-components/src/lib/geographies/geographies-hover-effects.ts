import { EventEffect } from '../events/effect';
import { GeographiesHoverDirective } from './geographies-hover.directive';
import { GeographiesComponent } from './geographies.component';

export class GeographiesHoverEmitTooltipData<
  T,
  U extends GeographiesComponent<T> = GeographiesComponent<T>
> implements EventEffect<GeographiesHoverDirective<T, U>>
{
  applyEffect(directive: GeographiesHoverDirective<T, U>): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: GeographiesHoverDirective<T, U>): void {
    directive.eventOutput.emit(null);
  }
}
