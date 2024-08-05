import { Geometry } from 'geojson';
import { HoverMoveAction } from '../../../events/action';
import { GeographiesComponent } from '../../geographies.component';
import { GeographiesHoverMoveDirective } from '../geographies-hover-move.directive';

export class GeographiesHoverMoveEmitTooltipData<
  Datum,
  TProperties,
  TGeometry extends Geometry,
  TComponent extends GeographiesComponent<
    Datum,
    TProperties,
    TGeometry
  > = GeographiesComponent<Datum, TProperties, TGeometry>,
> implements
    HoverMoveAction<
      GeographiesHoverMoveDirective<Datum, TProperties, TGeometry, TComponent>
    >
{
  onStart(
    directive: GeographiesHoverMoveDirective<
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
    directive: GeographiesHoverMoveDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >
  ): void {
    directive.eventOutput.emit(null);
  }
}
