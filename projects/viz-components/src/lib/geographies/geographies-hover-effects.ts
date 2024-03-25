import { Geometry } from 'geojson';
import { EventEffect } from '../events/effect';
import { GeographiesHoverDirective } from './geographies-hover.directive';
import { GeographiesComponent } from './geographies.component';

export class GeographiesHoverEmitTooltipData<
  Datum,
  P,
  G extends Geometry,
  C extends GeographiesComponent<Datum, P, G> = GeographiesComponent<
    Datum,
    P,
    G
  >
> implements EventEffect<GeographiesHoverDirective<Datum, P, G, C>>
{
  applyEffect(directive: GeographiesHoverDirective<Datum, P, G, C>): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: GeographiesHoverDirective<Datum, P, G, C>): void {
    directive.eventOutput.emit(null);
  }
}
