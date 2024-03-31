import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  ExtendedGeometryCollection,
  geoAlbersUsa,
  GeoGeometryObjects,
  GeoProjection,
  interpolateLab,
  scaleLinear,
  scaleOrdinal,
  scaleQuantile,
  scaleQuantize,
  scaleThreshold,
} from 'd3';
import {
  GeoJsonProperties,
  GeometryObject as Geometry,
  MultiPolygon,
  Polygon,
} from 'geojson';
import { VicDataDimensionConfig } from '../data-marks/data-dimension.config';
import {
  VicDataMarksConfig,
  VicPatternPredicate,
} from '../data-marks/data-marks.config';
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

/**
 * Configuration object for geographies that have attribute data.
 *
 * The generic parameters are the same as those in VicGeographiesConfig.
 */
export class VicDataGeographyConfig<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends VicBaseDataGeographyConfig<Datum, TProperties, TGeometry> {
  attributeDataConfig:
    | VicCategoricalAttributeDataDimensionConfig<Datum>
    | VicNoBinsQuantitativeAttributeDataDimensionConfig<Datum>
    | VicEqualValuesQuantitativeAttributeDataDimensionConfig<Datum>
    | VicEqualNumbersQuantitativeAttributeDataDimensionConfig<Datum>
    | VicCustomBreaksQuantitativeAttributeDataDimensionConfig<Datum>;
  nullColor: string;

  constructor(
    init?: Partial<VicDataGeographyConfig<Datum, TProperties, TGeometry>>
  ) {
    super();
    this.nullColor = '#dcdcdc';
    this.strokeColor = 'dimgray';
    this.strokeWidth = '1';
    Object.assign(this, init);
  }
}

/**
 * Configuration object for attribute data that will be used to shade the map.
 *
 * The generic parameter is the type of the attribute data.
 */
abstract class AttributeDataDimensionConfig<
  Datum
> extends VicDataDimensionConfig<Datum> {
  geoAccessor: (d: Datum, ...args: any) => any;
  range: any[];
  colorScale: (...args: any) => any;
  colors?: string[];
  interpolator: (...args: any) => any;
  patternPredicates?: VicPatternPredicate<Datum>[];
}

/**
 * Enum that defines the types of binning that can be used to map quantitative attribute data to colors.
 */
export enum VicValuesBin {
  none = 'none',
  categorical = 'categorical',
  equalValueRanges = 'equalValueRanges',
  equalNumObservations = 'equalNumObservations',
  customBreaks = 'customBreaks',
}

export type VicAttributeDataDimensionConfig<Datum> =
  | VicCategoricalAttributeDataDimensionConfig<Datum>
  | VicNoBinsQuantitativeAttributeDataDimensionConfig<Datum>
  | VicEqualValuesQuantitativeAttributeDataDimensionConfig<Datum>
  | VicEqualNumbersQuantitativeAttributeDataDimensionConfig<Datum>
  | VicCustomBreaksQuantitativeAttributeDataDimensionConfig<Datum>;

/**
 * Configuration object for attribute data that is categorical.
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicCategoricalAttributeDataDimensionConfig<
  Datum
> extends AttributeDataDimensionConfig<Datum> {
  binType: VicValuesBin.categorical = VicValuesBin.categorical;
  override interpolator: never;

  constructor(
    init?: Partial<VicCategoricalAttributeDataDimensionConfig<Datum>>
  ) {
    super();
    this.colorScale = scaleOrdinal;
    this.colors = ['white', 'lightslategray'];
    Object.assign(this, init);
  }
}

/**
 * Configuration object for attribute data that is quantitative.
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicNoBinsQuantitativeAttributeDataDimensionConfig<
  Datum
> extends AttributeDataDimensionConfig<Datum> {
  binType: VicValuesBin.none = VicValuesBin.none;
  constructor(
    init?: Partial<VicNoBinsQuantitativeAttributeDataDimensionConfig<Datum>>
  ) {
    super();
    this.colorScale = scaleLinear;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
  }
}

/**
 * Configuration object for attribute data that is quantitative and will be binned into equal value ranges. For example, if the data is [0, 1, 2, 4, 60, 100] and numBins is 2, the bin ranges will be [0, 49] and [50, 100].
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicEqualValuesQuantitativeAttributeDataDimensionConfig<
  Datum
> extends AttributeDataDimensionConfig<Datum> {
  binType: VicValuesBin.equalValueRanges = VicValuesBin.equalValueRanges;
  numBins: number;
  constructor(
    init?: Partial<
      VicEqualValuesQuantitativeAttributeDataDimensionConfig<Datum>
    >
  ) {
    super();
    this.colorScale = scaleQuantize;
    this.interpolator = interpolateLab;
    this.numBins = 5;
    Object.assign(this, init);
  }
}

/**
 * Configuration object for attribute data that is quantitative and will be binned into equal number of observations. For example, if the data is [0, 1, 2, 4, 60, 100] and numBins is 2, the bin ranges will be [0, 2] and [4, 100].
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicEqualNumbersQuantitativeAttributeDataDimensionConfig<
  Datum
> extends AttributeDataDimensionConfig<Datum> {
  binType: VicValuesBin.equalNumObservations =
    VicValuesBin.equalNumObservations;
  numBins: number;
  constructor(
    init?: Partial<
      VicEqualNumbersQuantitativeAttributeDataDimensionConfig<Datum>
    >
  ) {
    super();
    this.colorScale = scaleQuantile;
    this.interpolator = interpolateLab;
    this.numBins = 5;
    Object.assign(this, init);
  }
}

/**
 * Configuration object for attribute data that is quantitative and will be binned into custom breaks. For example, if the data is [0, 1, 2, 4, 60, 100] and breakValues is [0, 2, 5, 10, 50], the bin ranges will be [0, 2], [2, 5], [5, 10], [10, 50], [50, 100].
 *
 * The generic parameter is the type of the attribute data.
 */

export class VicCustomBreaksQuantitativeAttributeDataDimensionConfig<
  Datum
> extends AttributeDataDimensionConfig<Datum> {
  binType: VicValuesBin.customBreaks = VicValuesBin.customBreaks;
  breakValues: number[];
  numBins: number;

  constructor(
    init?: Partial<
      VicCustomBreaksQuantitativeAttributeDataDimensionConfig<Datum>
    >
  ) {
    super();
    this.colorScale = scaleThreshold;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
    this.numBins = undefined;
  }
}

export interface VicGeographyNoDataPatternPredicate<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> {
  patternName: string;
  predicate: (d: VicGeographiesFeature<TProperties, TGeometry>) => boolean;
}

export class VicNoDataGeographyConfig<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends VicBaseDataGeographyConfig<Datum, TProperties, TGeometry> {
  /**
   * The pattern for noDataGeography. If provided, fill will be overridden.
   */
  patternPredicates?: VicGeographyNoDataPatternPredicate<
    TProperties,
    TGeometry
  >[];

  constructor(
    init?: Partial<VicNoDataGeographyConfig<Datum, TProperties, TGeometry>>
  ) {
    super();
    this.strokeColor = 'dimgray';
    this.strokeWidth = '1';
    this.fill = 'none';
    Object.assign(this, init);
  }
}
