import { Geometry } from 'geojson';
import { HoverMoveEventEffect } from '../../../events/effect';
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
    HoverMoveEventEffect<
      GeographiesHoverMoveDirective<Datum, TProperties, TGeometry, TComponent>
    >
{
  applyEffect(
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

  removeEffect(
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
