import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';
import { GeographiesHoverDirective } from './geographies-hover.directive';
import { GeographiesInputEventDirective } from './geographies-input-event.directive';
import { GeographiesComponent } from './geographies.component';

export type GeographiesEventDirective<
  Datum,
  ExtendedGeographiesComponent extends GeographiesComponent<Datum> = GeographiesComponent<Datum>
> =
  | GeographiesHoverDirective<Datum, ExtendedGeographiesComponent>
  | GeographiesHoverMoveDirective<Datum, ExtendedGeographiesComponent>
  | GeographiesInputEventDirective<Datum, ExtendedGeographiesComponent>;
