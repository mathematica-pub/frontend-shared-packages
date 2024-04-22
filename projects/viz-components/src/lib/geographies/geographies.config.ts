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
import { VicDataMarksConfig } from '../data-marks/data-marks.config';
import { VicDataGeographyConfig } from './dimensions/data-geographies';
import { VicNoDataGeographyConfig } from './dimensions/no-data-geographies';
import { VicGeographiesFeature } from './geographies';
import { VicGeographyLabelConfig } from './geographies-labels';

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
> extends VicDataMarksConfig<Datum> {
  /** A feature or geometry object or collection that defines the extents of the map to be drawn.
   * Used for scaling the map.
   */
  boundary:
    | ExtendedFeature
    | ExtendedFeatureCollection
    | GeoGeometryObjects
    | ExtendedGeometryCollection;

  /**
   * A projection function that maps a point in the map's coordinate space to a point in the SVG's coordinate space.
   * @default: d3.geoAlbersUsa().
   */
  projection: GeoProjection;
  /**
   * A function that derives an identifying string or number from the GeoJson feature.
   */
  featureIndexAccessor?: (
    d: VicGeographiesFeature<TProperties, TGeometry>
  ) => string | number;
  /**
   * A configuration object that pertains to geographies that a user wants to draw without attribute data, for example the outline of a country.
   */
  noDataGeographiesConfigs?: VicNoDataGeographyConfig<
    Datum,
    TProperties,
    TGeometry
  >[];
  /**
   * A configuration object that pertains to geographies that have attribute data, for example, states in the US each of which have a value for % unemployment.
   */
  dataGeographyConfig: VicDataGeographyConfig<Datum, TProperties, TGeometry>;

  constructor(
    init?: Partial<VicGeographiesConfig<Datum, TProperties, TGeometry>>
  ) {
    super();
    this.projection = geoAlbersUsa();
    Object.assign(this, init);
  }
}

/**
 * Base configuration object for geographies that can be used with or without attribute data.
 *
 * The generic parameters are the same as those in VicGeographiesConfig.
 */
export class VicBaseDataGeographyConfig<
  Datum,
  TProperties,
  TGeometry extends Geometry
> {
  /**
   * GeoJSON features that define the geographies to be drawn.
   */
  geographies: Array<VicGeographiesFeature<TProperties, TGeometry>>;
  /**
   * The fill color for the geography.
   * @default: 'none'.
   */
  fill: string;
  /**
   * The color of the stroke for the geography.
   * @default: 'dimgray'.
   */
  strokeColor: string;
  /**
   * The width of the stroke for the geography.
   * @default: 1.
   */
  strokeWidth: string;
  /**
   * VicGeographyLabelConfig that define the labels to be shown.
   * If not defined, no labels will be drawn.
   */
  labels: VicGeographyLabelConfig<Datum, TProperties, TGeometry>;
}
