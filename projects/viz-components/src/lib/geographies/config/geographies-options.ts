import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  ExtendedGeometryCollection,
  GeoGeometryObjects,
  GeoProjection,
} from 'd3';
import { GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicDataMarksOptions } from '../../data-marks/config/data-marks-options';
import { VicGeographiesFeature } from '../geographies-feature';
import { VicGeographiesAttributeDataLayer } from './layers/attribute-data-layer/attribute-data-layer';
import { VicGeographiesGeojsonPropertiesLayer } from './layers/geojson-properties-layer/geojson-properties-layer';

export interface VicGeographiesOptions<
  Datum,
  TProperties extends GeoJsonProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends VicDataMarksOptions<Datum> {
  boundary:
    | ExtendedFeature
    | ExtendedFeatureCollection
    | GeoGeometryObjects
    | ExtendedGeometryCollection;
  data: never;
  attributeDataLayer: VicGeographiesAttributeDataLayer<
    Datum,
    TProperties,
    TGeometry
  >;
  featureIndexAccessor: (
    d: VicGeographiesFeature<TProperties, TGeometry>
  ) => string;
  geojsonPropertiesLayers: VicGeographiesGeojsonPropertiesLayer<
    TProperties,
    TGeometry
  >[];
  projection: GeoProjection;
}
