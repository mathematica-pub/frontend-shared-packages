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
import { VicGeographiesAttributeDataLayerBuilder } from './layers/attribute-data-layer/attribute-data-layer-builder';
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
@Injectable()
export class VicGeographiesBuilder<
  Datum,
  TProperties extends GeoJsonProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> {
  private _boundary:
    | ExtendedFeature
    | ExtendedFeatureCollection
    | GeoGeometryObjects
    | ExtendedGeometryCollection;
  private _featureIndexAccessor: (
    d: VicGeographiesFeature<TProperties, TGeometry>
  ) => string;
  private _mixBlendMode: string;
  private _projection: GeoProjection;
  private attributeDataBuilder: VicGeographiesAttributeDataLayerBuilder<
    Datum,
    TProperties,
    TGeometry
  >;
  public geojsonBuilders: VicGeographiesGeojsonPropertiesLayerBuilder<
    TProperties,
    TGeometry
  >[] = [];

  constructor() {
    Object.assign(this, DEFAULT);
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

  createGeojsonPropertiesLayer(
    callback: (
      builder: VicGeographiesGeojsonPropertiesLayerBuilder<
        TProperties,
        TGeometry
      >
    ) => void
  ): this {
    const builder = new VicGeographiesGeojsonPropertiesLayerBuilder<
      TProperties,
      TGeometry
    >();
    callback(builder);
    this.geojsonBuilders.push(builder);
    return this;
  }

  createAttributeDataLayer(
    callback: (
      builder: VicGeographiesAttributeDataLayerBuilder<
        Datum,
        TProperties,
        TGeometry
      >
    ) => void
  ): this {
    this.attributeDataBuilder = new VicGeographiesAttributeDataLayerBuilder<
      Datum,
      TProperties,
      TGeometry
    >();
    callback(this.attributeDataBuilder);
    return this;
  }
  /**
   * Sets a configuration object that pertains to geographies that will be drawn and styled using solely the properties on a geojson feature. This might be used for to draw the outline of a country, for example. If events are enabled, the geojson properties will be used to populate the tooltip.
   */

  mixBlendMode(mixBlendMode: string): this {
    this._mixBlendMode = mixBlendMode;
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
      attributeDataLayer: this.attributeDataBuilder.build(),
      boundary: this._boundary,
      data: null,
      mixBlendMode: this._mixBlendMode,
      featureIndexAccessor: this._featureIndexAccessor,
      geojsonPropertiesLayers: this.geojsonBuilders.map((builder) =>
        builder.build()
      ),
      projection: this._projection,
    });
  }
}
