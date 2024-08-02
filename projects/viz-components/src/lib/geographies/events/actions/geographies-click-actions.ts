import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { EventAction } from '../../../events/action';
import { GeographiesComponent } from '../../geographies.component';
import { GeographiesClickDirective } from '../geographies-click.directive';

export class GeographiesClickEmitTooltipDataPauseHoverMoveActions<
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
      GeographiesClickDirective<Datum, TProperties, TGeometry, TComponent>
    >
{
  onStart(
    directive: GeographiesClickDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >
  ) {
    const tooltipData = directive.getOutputData();
    directive.preventHoverActions();
    directive.eventOutput.emit(tooltipData);
  }

  onEnd(
    directive: GeographiesClickDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >
  ) {
    directive.resumeHoverActions();
    directive.eventOutput.emit(null);
  }
}
