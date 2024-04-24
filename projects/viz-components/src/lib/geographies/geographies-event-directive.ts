import { Geometry } from 'geojson';
import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';
import { GeographiesHoverDirective } from './geographies-hover.directive';
import { GeographiesInputEventDirective } from './geographies-input-event.directive';
import { GeographiesComponent } from './geographies.component';

export type GeographiesEventDirective<
  Datum,
  TProperties,
  TGeometry extends Geometry,
  TComponent extends GeographiesComponent<
    Datum,
    TProperties,
    TGeometry
  > = GeographiesComponent<Datum, TProperties, TGeometry>
> =
  | GeographiesHoverDirective<Datum, TProperties, TGeometry, TComponent>
  | GeographiesHoverMoveDirective<Datum, TProperties, TGeometry, TComponent>
  | GeographiesInputEventDirective<Datum, TProperties, TGeometry, TComponent>;
