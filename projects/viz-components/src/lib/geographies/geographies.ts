/**
 * A utility type that represents a GeoJson feature with a properties object of type TProperties and a geometry object of type TGeometry.
 */

import {
  Feature,
  GeoJsonProperties,
  Geometry,
  MultiPolygon,
  Polygon,
} from 'geojson';

export type VicGeographiesFeature<
  TProperties extends GeoJsonProperties = GeoJsonProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
> = Feature<TGeometry, TProperties>;
