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
import { VicDataMarksConfig } from '../../data-marks/config/data-marks-config';
import { VicGeographiesFeature } from '../geographies-feature';
import { VicGeographiesOptions } from './geographies-options';
import { VicGeographiesAttributeDataLayer } from './layers/attribute-data-layer/attribute-data-layer';
import { VicGeographiesGeojsonPropertiesLayer } from './layers/geojson-properties-layer/geojson-properties-layer';

export class VicGeographiesConfig<
    Datum,
    TProperties extends GeoJsonProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon
  >
  extends VicDataMarksConfig<Datum>
  implements VicGeographiesOptions<Datum, TProperties, TGeometry>
{
  readonly boundary:
    | ExtendedFeature
    | ExtendedFeatureCollection
    | GeoGeometryObjects
    | ExtendedGeometryCollection;
  override data: never;
  readonly attributeDataLayer: VicGeographiesAttributeDataLayer<
    Datum,
    TProperties,
    TGeometry
  >;
  featureIndexAccessor: (
    d: VicGeographiesFeature<TProperties, TGeometry>
  ) => string;
  layers: (
    | VicGeographiesAttributeDataLayer<Datum, TProperties, TGeometry>
    | VicGeographiesGeojsonPropertiesLayer<TProperties, TGeometry>
  )[];
  readonly geojsonPropertiesLayers: VicGeographiesGeojsonPropertiesLayer<
    TProperties,
    TGeometry
  >[];
  readonly projection: GeoProjection;

  constructor(
    options: Partial<VicGeographiesOptions<Datum, TProperties, TGeometry>>
  ) {
    super();
    Object.assign(this, options);
    this.initPropertiesFromData();
  }

  protected initPropertiesFromData(): void {
    this.setLayers();
    this.setLayerFeatureIndexAccessors();
  }

  private setLayers(): void {
    if (!this.attributeDataLayer && !this.geojsonPropertiesLayers) {
      console.error('Geographies config requires at least one layer');
    }
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
