import { Injectable } from '@angular/core';
import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  ExtendedGeometryCollection,
  geoAlbersUsa,
  GeoGeometryObjects,
  GeoProjection,
} from 'd3';
import { GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicGeographiesFeature } from '../geographies-feature';
import { VicGeographiesConfig } from './geographies-config';
import { VicGeographiesAttributeDataLayer } from './layers/attribute-data-layer/attribute-data-layer';
import { VicGeographiesAttributeDataLayerBuilder } from './layers/attribute-data-layer/attribute-data-layer-builder';
import { VicGeographiesGeojsonPropertiesLayer } from './layers/geojson-properties-layer/geojson-properties-layer';
import { VicGeographiesGeojsonPropertiesLayerBuilder } from './layers/geojson-properties-layer/geojson-properties-layer-builder';

const DEFAULT = {
  _projection: geoAlbersUsa(),
};

/** Primary configuration object to specify a map with attribute data, intended to be used with GeographiesComponent.
 * The first generic parameter, Datum, is the type of the attribute data that will be used to shade the map areas.
 *
 * The second generic parameter, TProperties, is the type of the properties object that is associated with the GeoJson.
 *
 * The third generic parameter, TGeometry, is the type of the geometry object that is associated with the GeoJson.
 */
@Injectable({ providedIn: 'root' })
export class VicGeographiesBuilder<
  Datum,
  TProperties extends GeoJsonProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> {
  private _attributeDataLayer: VicGeographiesAttributeDataLayer<
    Datum,
    TProperties,
    TGeometry
  >;
  private _boundary:
    | ExtendedFeature
    | ExtendedFeatureCollection
    | GeoGeometryObjects
    | ExtendedGeometryCollection;
  private _featureIndexAccessor: (
    d: VicGeographiesFeature<TProperties, TGeometry>
  ) => string;
  private _geojsonPropertiesLayers: VicGeographiesGeojsonPropertiesLayer<
    TProperties,
    TGeometry
  >[];
  private _projection: GeoProjection;

  constructor(
    public attributeDataLayerBuilder: VicGeographiesAttributeDataLayerBuilder<
      Datum,
      TProperties,
      TGeometry
    >,
    public geojsonPropertiesLayerBuilder: VicGeographiesGeojsonPropertiesLayerBuilder<
      TProperties,
      TGeometry
    >
  ) {
    Object.assign(this, DEFAULT);
  }

  /**
   * Sets a configuration object that pertains to geographies should be styled according to a provided array of attribute data -- for example, states in the US each of which have a value for % unemployment.
   */
  attributeDataLayer(
    layer: VicGeographiesAttributeDataLayer<Datum, TProperties, TGeometry>
  ): this {
    this._attributeDataLayer = layer;
    return this;
  }

  /** Sets a feature or geometry object or collection that defines the extents of the map to be drawn.
   * Used for scaling the map.
   */
  boundary(
    boundary:
      | ExtendedFeature
      | ExtendedFeatureCollection
      | GeoGeometryObjects
      | ExtendedGeometryCollection
  ): this {
    this._boundary = boundary;
    return this;
  }

  /**
   * Sets a function that derives an identifying string from the GeoJson feature.
   */
  featureIndexAccessor(
    accessor: (d: VicGeographiesFeature<TProperties, TGeometry>) => string
  ): this {
    this._featureIndexAccessor = accessor;
    return this;
  }

  /**
   * Sets a configuration object that pertains to geographies that will be drawn and styled using solely the properties on a geojson feature. This might be used for to draw the outline of a country, for example. If events are enabled, the geojson properties will be used to populate the tooltip.
   */
  geojsonPropertiesLayers(
    layers: VicGeographiesGeojsonPropertiesLayer<TProperties, TGeometry>[]
  ): this {
    this._geojsonPropertiesLayers = layers;
    return this;
  }

  /**
   * Sets a projection function that maps a point in the map's coordinate space to a point in the SVG's coordinate space.
   *
   * If not set the default is d3.geoAlbersUsa().
   */
  projection(projection: GeoProjection): this {
    this._projection = projection;
    return this;
  }

  build(): VicGeographiesConfig<Datum, TProperties, TGeometry> {
    return new VicGeographiesConfig<Datum, TProperties, TGeometry>({
      attributeDataLayer: this._attributeDataLayer,
      boundary: this._boundary,
      featureIndexAccessor: this._featureIndexAccessor,
      geojsonPropertiesLayers: this._geojsonPropertiesLayers,
      projection: this._projection,
    });
  }
}
