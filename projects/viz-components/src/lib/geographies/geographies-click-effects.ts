import { Geometry } from 'geojson';
import { EventEffect } from '../events/effect';
import { GeographiesClickDirective } from './geographies-click.directive';
import { GeographiesComponent } from './geographies.component';

export class GeographiesClickEmitTooltipDataPauseHoverMoveEffects<
  Datum,
  P,
  G extends Geometry,
  C extends GeographiesComponent<Datum, P, G> = GeographiesComponent<
    Datum,
    P,
    G
  >
> implements EventEffect<GeographiesClickDirective<Datum, P, G, C>>
{
  applyEffect(directive: GeographiesClickDirective<Datum, P, G, C>) {
    const tooltipData = directive.getOutputData();
    directive.preventHoverEffects();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: GeographiesClickDirective<Datum, P, G, C>) {
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}
