import { EventEffect } from '../events/effect';
import { GeographiesHoverDirective } from './geographies-hover.directive';
import { GeographiesComponent } from './geographies.component';

export class GeographiesHoverEmitTooltipData<
  Datum,
  ExtendedGeographiesComponent extends GeographiesComponent<Datum> = GeographiesComponent<Datum>
> implements
    EventEffect<GeographiesHoverDirective<Datum, ExtendedGeographiesComponent>>
{
  applyEffect(
    directive: GeographiesHoverDirective<Datum, ExtendedGeographiesComponent>
  ): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(
    directive: GeographiesHoverDirective<Datum, ExtendedGeographiesComponent>
  ): void {
    directive.eventOutput.emit(null);
  }
}
