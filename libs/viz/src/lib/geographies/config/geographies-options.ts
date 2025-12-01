import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  ExtendedGeometryCollection,
  GeoGeometryObjects,
  GeoProjection,
} from 'd3';
import { GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson';
import { MarksOptions } from '../../marks/config/marks-options';
import { GeographiesFeature } from '../geographies-feature';
import { GeographiesAttributeDataLayer } from './layers/attribute-data-layer/attribute-data-layer';
import { GeographiesGeojsonPropertiesLayer } from './layers/geojson-properties-layer/geojson-properties-layer';

export interface GeographiesOptions<
  Datum,
  TProperties extends GeoJsonProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
> extends MarksOptions {
  boundary:
    | ExtendedFeature
    | ExtendedFeatureCollection
    | GeoGeometryObjects
    | ExtendedGeometryCollection;
  attributeDataLayer: GeographiesAttributeDataLayer<
    Datum,
    TProperties,
    TGeometry
  >;
  featureIndexAccessor: (
    d: GeographiesFeature<TProperties, TGeometry>
  ) => string;
  geojsonPropertiesLayers: GeographiesGeojsonPropertiesLayer<
    TProperties,
    TGeometry
  >[];
  projection: GeoProjection;
}
