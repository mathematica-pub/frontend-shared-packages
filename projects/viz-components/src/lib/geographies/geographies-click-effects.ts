import { EventEffect } from '../events/effect';
import { GeographiesClickDirective } from './geographies-click.directive';
import { GeographiesComponent } from './geographies.component';

export class GeographiesClickEmitTooltipDataPauseHoverMoveEffects<
  T,
  U extends GeographiesComponent<T> = GeographiesComponent<T>
> implements EventEffect<GeographiesClickDirective<T, U>>
{
  applyEffect(directive: GeographiesClickDirective<T, U>) {
    const tooltipData = directive.getOutputData();
    directive.preventHoverEffects();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: GeographiesClickDirective<T, U>) {
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}
