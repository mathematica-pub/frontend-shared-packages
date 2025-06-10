import { safeAssign } from '@hsi/app-dev-kit';
import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  ExtendedGeometryCollection,
  GeoGeometryObjects,
  GeoProjection,
} from 'd3';
import {
  GeoJsonProperties,
  GeometryObject as Geometry,
  MultiPolygon,
  Polygon,
} from 'geojson';
import { MarksConfig } from '../../marks';
import { GeographiesFeature } from '../geographies-feature';
import { GeographiesOptions } from './geographies-options';
import { GeographiesAttributeDataLayer } from './layers/attribute-data-layer/attribute-data-layer';
import { GeographiesGeojsonPropertiesLayer } from './layers/geojson-properties-layer/geojson-properties-layer';

export class GeographiesConfig<
    Datum,
    TProperties extends GeoJsonProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon,
  >
  extends MarksConfig
  implements GeographiesOptions<Datum, TProperties, TGeometry>
{
  readonly boundary:
    | ExtendedFeature
    | ExtendedFeatureCollection
    | GeoGeometryObjects
    | ExtendedGeometryCollection;
  readonly attributeDataLayer: GeographiesAttributeDataLayer<
    Datum,
    TProperties,
    TGeometry
  >;
  featureIndexAccessor: (
    d: GeographiesFeature<TProperties, TGeometry>
  ) => string;
  layers: (
    | GeographiesAttributeDataLayer<Datum, TProperties, TGeometry>
    | GeographiesGeojsonPropertiesLayer<TProperties, TGeometry>
  )[];
  readonly geojsonPropertiesLayers: GeographiesGeojsonPropertiesLayer<
    TProperties,
    TGeometry
  >[];
  readonly projection: GeoProjection;

  constructor(options: GeographiesOptions<Datum, TProperties, TGeometry>) {
    super();
    safeAssign(this, options);
    this.initPropertiesFromData();
  }

  protected initPropertiesFromData(): void {
    this.setLayers();
    this.setLayerFeatureIndexAccessors();
  }

  private setLayers(): void {
    this.layers = [];
    if (this.attributeDataLayer) {
      this.layers.push(this.attributeDataLayer);
    }
    if (this.geojsonPropertiesLayers) {
      this.layers.push(...this.geojsonPropertiesLayers);
    }
    this.layers.forEach((layer, i) => {
      layer.id = i;
    });
  }

  private setLayerFeatureIndexAccessors(): void {
    this.layers.forEach((layer) =>
      layer.setFeatureIndexAccessor(this.featureIndexAccessor)
    );
  }
}
