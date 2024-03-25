import { Geometry } from 'geojson';
import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';
import { GeographiesHoverDirective } from './geographies-hover.directive';
import { GeographiesInputEventDirective } from './geographies-input-event.directive';
import { GeographiesComponent } from './geographies.component';

export type GeographiesEventDirective<
  Datum,
  P,
  G extends Geometry,
  C extends GeographiesComponent<Datum, P, G> = GeographiesComponent<
    Datum,
    P,
    G
  >
> =
  | GeographiesHoverDirective<Datum, P, G, C>
  | GeographiesHoverMoveDirective<Datum, P, G, C>
  | GeographiesInputEventDirective<Datum, P, G, C>;
