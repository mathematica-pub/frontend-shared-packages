import { Geometry } from 'geojson';
import { GeographiesComponent } from '../geographies.component';
import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';
import { GeographiesHoverDirective } from './geographies-hover.directive';
import { GeographiesInputEventDirective } from './geographies-input-event.directive';

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
