import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { EventEffect } from '../events/effect';
import { GeographiesHoverDirective } from './geographies-hover.directive';
import { GeographiesComponent } from './geographies.component';

export class GeographiesHoverEmitTooltipData<
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
      GeographiesHoverDirective<Datum, TProperties, TGeometry, TComponent>
    >
{
  applyEffect(
    directive: GeographiesHoverDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >
  ): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(
    directive: GeographiesHoverDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >
  ): void {
    directive.eventOutput.emit(null);
  }
}
