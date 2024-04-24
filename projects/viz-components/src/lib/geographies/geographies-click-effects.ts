import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { EventEffect } from '../events/effect';
import { GeographiesClickDirective } from './geographies-click.directive';
import { GeographiesComponent } from './geographies.component';

export class GeographiesClickEmitTooltipDataPauseHoverMoveEffects<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
  TComponent extends GeographiesComponent<
    Datum,
    TProperties,
    TGeometry
  > = GeographiesComponent<Datum, TProperties, TGeometry>
> implements
    EventEffect<
      GeographiesClickDirective<Datum, TProperties, TGeometry, TComponent>
    >
{
  applyEffect(
    directive: GeographiesClickDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >
  ) {
    const tooltipData = directive.getOutputData();
    directive.preventHoverEffects();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(
    directive: GeographiesClickDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >
  ) {
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}
