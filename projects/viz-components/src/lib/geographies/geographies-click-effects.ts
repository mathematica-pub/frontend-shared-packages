import { EventEffect } from '../events/effect';
import { GeographiesClickDirective } from './geographies-click.directive';
import { GeographiesComponent } from './geographies.component';

export class GeographiesClickEmitTooltipDataPauseHoverMoveEffects<
  Datum,
  ExtendedGeographiesComponent extends GeographiesComponent<Datum> = GeographiesComponent<Datum>
> implements
    EventEffect<GeographiesClickDirective<Datum, ExtendedGeographiesComponent>>
{
  applyEffect(
    directive: GeographiesClickDirective<Datum, ExtendedGeographiesComponent>
  ) {
    const tooltipData = directive.getOutputData();
    directive.preventHoverEffects();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(
    directive: GeographiesClickDirective<Datum, ExtendedGeographiesComponent>
  ) {
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}
