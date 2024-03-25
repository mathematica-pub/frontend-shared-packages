import { Geometry } from 'geojson';
import { HoverMoveEventEffect } from '../events/effect';
import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';
import { GeographiesComponent } from './geographies.component';

export class GeographiesHoverMoveEmitTooltipData<
  Datum,
  P,
  G extends Geometry,
  C extends GeographiesComponent<Datum, P, G> = GeographiesComponent<
    Datum,
    P,
    G
  >
> implements
    HoverMoveEventEffect<GeographiesHoverMoveDirective<Datum, P, G, C>>
{
  applyEffect(directive: GeographiesHoverMoveDirective<Datum, P, G, C>): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: GeographiesHoverMoveDirective<Datum, P, G, C>): void {
    directive.eventOutput.emit(null);
  }
}
