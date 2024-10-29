import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { EventAction } from '../../../events/action';
import { GeographiesComponent } from '../../geographies.component';
import { GeographiesHoverDirective } from '../geographies-hover.directive';

export class GeographiesHoverEmitTooltipData<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
  TComponent extends GeographiesComponent<
    Datum,
    TProperties,
    TGeometry
  > = GeographiesComponent<Datum, TProperties, TGeometry>,
> implements
    EventAction<
      GeographiesHoverDirective<Datum, TProperties, TGeometry, TComponent>
    >
{
  onStart(
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

  onEnd(
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
