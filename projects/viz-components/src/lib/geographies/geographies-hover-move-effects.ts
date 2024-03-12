import { HoverMoveEventEffect } from '../events/effect';
import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';
import { GeographiesComponent } from './geographies.component';

export class GeographiesHoverMoveEmitTooltipData<
  Datum,
  ExtendedGeographiesComponent extends GeographiesComponent<Datum> = GeographiesComponent<Datum>
> implements
    HoverMoveEventEffect<
      GeographiesHoverMoveDirective<Datum, ExtendedGeographiesComponent>
    >
{
  applyEffect(
    directive: GeographiesHoverMoveDirective<
      Datum,
      ExtendedGeographiesComponent
    >
  ): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(
    directive: GeographiesHoverMoveDirective<
      Datum,
      ExtendedGeographiesComponent
    >
  ): void {
    directive.eventOutput.emit(null);
  }
}
