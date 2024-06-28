import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  ExtendedGeometryCollection,
  geoAlbersUsa,
  GeoGeometryObjects,
  GeoProjection,
} from 'd3';
import {
  GeoJsonProperties,
  GeometryObject as Geometry,
  MultiPolygon,
  Polygon,
} from 'geojson';
import {
  VicDataMarksConfig,
  VicDataMarksOptions,
} from '../../data-marks/data-marks.config';
import { VicGeographiesFeature } from '../geographies-feature';
import { VicGeographiesDataLayer } from './layers/data-layer';
import { VicGeographiesGeojsonPropertiesLayer } from './layers/no-data-layer';

const DEFAULT = {
  projection: geoAlbersUsa(),
};

export interface VicGeographiesOptions<
  Datum,
  TProperties extends GeoJsonProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends VicDataMarksOptions<Datum> {
  /** A feature or geometry object or collection that defines the extents of the map to be drawn.
   * Used for scaling the map.
   */
  boundary:
    | ExtendedFeature
    | ExtendedFeatureCollection
    | GeoGeometryObjects
    | ExtendedGeometryCollection;
  data: never;
  /**
   * A configuration object that pertains to geographies should be styled according to a provided array of attribute data -- for example, states in the US each of which have a value for % unemployment.
   */
  attributeDataLayer: VicGeographiesDataLayer<Datum, TProperties, TGeometry>;
  /**
   * A function that derives an identifying string from the GeoJson feature.
   */
  featureIndexAccessor: (
    d: VicGeographiesFeature<TProperties, TGeometry>
  ) => string;
  /**
   * A configuration object that pertains to geographies that will be drawn and styled using solely the properties on a geojson feature. This might be used for to draw the outline of a country, for example. If events are enabled, the geojson properties will be used to populate the tooltip.
   */
  geojsonPropertiesLayers: VicGeographiesGeojsonPropertiesLayer<
    TProperties,
    TGeometry
  >[];
  /**
   * A projection function that maps a point in the map's coordinate space to a point in the SVG's coordinate space.
   * @default: d3.geoAlbersUsa().
   */
  projection: GeoProjection;
}

/** Primary configuration object to specify a map with attribute data, intended to be used with GeographiesComponent.
 * Note that while a GeographiesComponent can create geographies without attribute data, for example, to create an
 * outline of a geographic area, it is not intended to draw maps that have no attribute data.
 *
 * The first generic parameter, Datum, is the type of the attribute data that will be used to shade the map areas.
 *
 * The second generic parameter, TProperties, is the type of the properties object that is associated with the GeoJson.
 *
 * The third generic parameter, TGeometry, is the type of the geometry object that is associated with the GeoJson.
 */
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
  readonly attributeDataLayer: VicGeographiesDataLayer<
    Datum,
    TProperties,
    TGeometry
  >;
  featureIndexAccessor: (
    d: VicGeographiesFeature<TProperties, TGeometry>
  ) => string;
  layers: (
    | VicGeographiesDataLayer<Datum, TProperties, TGeometry>
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
    this.projection = DEFAULT.projection;
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
