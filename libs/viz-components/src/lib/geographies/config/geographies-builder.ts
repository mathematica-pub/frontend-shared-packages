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
import { GeographiesFeature } from '../geographies-feature';
import { GeographiesConfig } from './geographies-config';
import { GeographiesAttributeDataLayerBuilder } from './layers/attribute-data-layer/attribute-data-layer-builder';
import { GeographiesGeojsonPropertiesLayerBuilder } from './layers/geojson-properties-layer/geojson-properties-layer-builder';
import _ = require('cypress/types/lodash');

const DEFAULT = {
  _projection: geoAlbersUsa(),
  _mixBlendMode: 'normal',
};

/** Builds a configuration object for a GeographiesComponent.
 *
 * Must be added to a providers array in or above the component that consumes it if it is injected via the constructor. (e.g. `providers: [VicGeographiesBuilder]` in the component decorator)
 *
 * The first generic parameter, Datum, is the type of the attribute data that will be used to shade the map areas.
 *
 * The second generic parameter, TProperties, is the type of the properties object that is associated with the GeoJson.
 *
 * The optional third generic parameter, TGeometry, is the type of the geometry object that is associated with the GeoJson. It defaults to MultiPolygon | Polygon if not provided.
 */
@Injectable()
export class VicGeographiesConfigBuilder<
  Datum,
  TProperties extends GeoJsonProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
> {
  private _boundary:
    | ExtendedFeature
    | ExtendedFeatureCollection
    | GeoGeometryObjects
    | ExtendedGeometryCollection;
  private _featureIndexAccessor: (
    d: GeographiesFeature<TProperties, TGeometry>
  ) => string;
  private _mixBlendMode: string;
  private _projection: GeoProjection;
  private attributeDataBuilder: GeographiesAttributeDataLayerBuilder<
    Datum,
    TProperties,
    TGeometry
  >;
  public geojsonBuilders: GeographiesGeojsonPropertiesLayerBuilder<
    TProperties,
    TGeometry
  >[] = [];

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * REQUIRED. Sets a feature or geometry object or collection that defines the extents of the map to be drawn.
   *
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
   * REQUIRED. Sets a function that derives an identifying string from the GeoJson feature.
   */
  featureIndexAccessor(
    accessor: (d: GeographiesFeature<TProperties, TGeometry>) => string
  ): this {
    this._featureIndexAccessor = accessor;
    return this;
  }

  /**
   * OPTIONAL. Creates a configuration object for a layer that will be drawn and styled using solely the properties on a geojson feature.
   *
   * This might be used for to draw the outline of a country, for example. It could also shade the area of a country based on a property of the geojson feature.
   *
   * If events are enabled, the geojson properties will be used to populate the tooltip.
   *
   * This method can be called multiple times to create multiple layers. If this method is called with null, all layers will be removed. (Though subsequent calls can be made to add new layers.)
   *
   * The order in which layers are created will determine the order in which they are drawn.
   *
   * Multiple layers can be used to draw different parts of the map with different styles.
   */
  geojsonPropertiesLayer(geojson: null): this;
  geojsonPropertiesLayer(
    geojson: (
      geojson: GeographiesGeojsonPropertiesLayerBuilder<TProperties, TGeometry>
    ) => void
  ): this;
  geojsonPropertiesLayer(
    geojson:
      | ((
          geojson: GeographiesGeojsonPropertiesLayerBuilder<
            TProperties,
            TGeometry
          >
        ) => void)
      | null
  ): this {
    if (geojson === null) {
      this.geojsonBuilders = [];
      return this;
    }
    const builder = new GeographiesGeojsonPropertiesLayerBuilder<
      TProperties,
      TGeometry
    >();
    geojson(builder);
    this.geojsonBuilders.push(builder);
    return this;
  }

  /**
   * OPTIONAL. Creates a configuration object for a layer that will be drawn from geojson and styled using attribute data.
   *
   * This object provides various methods for transforming data values into colors / color bins.
   *
   * This method can be called only once.
   */
  attributeDataLayer(attributeData: null): this;
  attributeDataLayer(
    attributeData: (
      attributeData: GeographiesAttributeDataLayerBuilder<
        Datum,
        TProperties,
        TGeometry
      >
    ) => void
  ): this;
  attributeDataLayer(
    attributeData:
      | ((
          attributeData: GeographiesAttributeDataLayerBuilder<
            Datum,
            TProperties,
            TGeometry
          >
        ) => void)
      | null
  ): this {
    if (attributeData === null) {
      this.attributeDataBuilder = undefined;
      return this;
    }
    this.attributeDataBuilder = new GeographiesAttributeDataLayerBuilder<
      Datum,
      TProperties,
      TGeometry
    >();
    attributeData(this.attributeDataBuilder);
    return this;
  }

  /**
   * OPTIONAL. Sets the mix-blend-mode of the marks.
   *
   * @default 'normal'
   */
  mixBlendMode(mixBlendMode: string): this {
    this._mixBlendMode = mixBlendMode;
    return this;
  }

  /**
   * OPTIONAL. Sets a projection function that maps a point in the map's coordinate space to a point in the SVG's coordinate space.
   *
   * @default d3.geoAlbersUsa()
   */
  projection(projection: GeoProjection): this {
    this._projection = projection;
    return this;
  }

  /**
   * REQUIRED. Builds the GeographiesConfig object.
   */
  getConfig(): GeographiesConfig<Datum, TProperties, TGeometry> {
    this.validateBuilder();
    const config = new GeographiesConfig<Datum, TProperties, TGeometry>({
      attributeDataLayer: this.attributeDataBuilder?._build(),
      boundary: this._boundary,
      data: null,
      mixBlendMode: this._mixBlendMode,
      featureIndexAccessor: this._featureIndexAccessor,
      geojsonPropertiesLayers: this.geojsonBuilders.length
        ? this.geojsonBuilders.map((builder) => builder._build())
        : undefined,
      projection: this._projection,
    });
    this.geojsonBuilders = [];
    return config;
  }

  private validateBuilder(): void {
    if (!this._boundary) {
      throw new Error('Boundary is required');
    }
    if (!this._featureIndexAccessor) {
      throw new Error('Feature index accessor is required');
    }
    if (!this.attributeDataBuilder && !this.geojsonBuilders.length) {
      throw new Error('At least one layer is required');
    }
  }
}
