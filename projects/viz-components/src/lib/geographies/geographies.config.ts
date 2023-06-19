import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  ExtendedGeometryCollection,
  geoAlbersUsa,
  GeoGeometryObjects,
  GeoProjection,
  interpolateLab,
  scaleLinear,
  scaleQuantile,
  scaleQuantize,
  scaleThreshold,
} from 'd3';
import { Feature } from 'geojson';
import { DataDimensionConfig } from '../data-marks/data-dimension.config';
import {
  DataMarksConfig,
  PatternPredicate,
} from '../data-marks/data-marks.config';

/** Primary configuration object to specify a map with attribute data, intended to be used with GeographiesComponent.
 * Note that while a GeographiesComponent can create geographies without attribute data, for example, to create an
 * outline of a geographic area, it is not intended to draw maps that have no attribute data.
 */
export class GeographiesConfig extends DataMarksConfig {
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
   * A configuration object that pertains to geographies that have no attribute data, for example the outline of a country.
   */
  noDataGeographiesConfigs?: NoDataGeographyConfig[];
  /**
   * A configuration object that pertains to geographies that have attribute data, for example, states in the US each of which have a value for % unemployment.
   */
  dataGeographyConfig: DataGeographyConfig;

  constructor(init?: Partial<GeographiesConfig>) {
    super();
    this.projection = geoAlbersUsa();
    Object.assign(this, init);
  }
}

export class NoDataGeographyConfig {
  /**
   * GeoJSON features that define the geographies to be drawn.
   */
  geographies: Feature[];
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
   * The fill color for the geography.
   * @default: 'none'.
   */
  fill: string;

  constructor(init?: Partial<NoDataGeographyConfig>) {
    this.strokeColor = 'dimgray';
    this.strokeWidth = '1';
    this.fill = 'none';
    Object.assign(this, init);
  }
}

export class DataGeographyConfig extends NoDataGeographyConfig {
  valueAccessor?: (d: any) => any;
  attributeDataConfig: AttributeDataDimensionConfig;
  nullColor: string;

  constructor(init?: Partial<DataGeographyConfig>) {
    super();
    this.nullColor = '#dcdcdc';
    Object.assign(this, init);
  }
}

export class AttributeDataDimensionConfig extends DataDimensionConfig {
  geoAccessor: (d: any) => any;
  valueType: string;
  binType: MapBinType;
  range: any[];
  colorScale: (...args: any) => any;
  colors?: string[];
  numBins?: number;
  breakValues?: number[];
  interpolator: (...args: any) => any;
  patternPredicates?: PatternPredicate[];
  constructor(init?: Partial<AttributeDataDimensionConfig>) {
    super();
    Object.assign(this, init);
  }
}

export type MapBinType =
  | 'none'
  | 'equal value ranges'
  | 'equal num observations'
  | 'custom breaks';

export class CategoricalAttributeDataDimensionConfig extends AttributeDataDimensionConfig {
  override interpolator: never;

  constructor(init?: Partial<CategoricalAttributeDataDimensionConfig>) {
    super();
    this.valueType = 'categorical';
    this.binType = 'none';
    this.colors = ['white', 'lightslategray'];
    Object.assign(this, init);
  }
}
export class NoBinsQuantitativeAttributeDataDimensionConfig extends AttributeDataDimensionConfig {
  constructor(init?: Partial<NoBinsQuantitativeAttributeDataDimensionConfig>) {
    super();
    this.valueType = 'quantitative';
    this.binType = 'none';
    this.colorScale = scaleLinear;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
  }
}

export class EqualValuesQuantitativeAttributeDataDimensionConfig extends AttributeDataDimensionConfig {
  constructor(
    init?: Partial<EqualValuesQuantitativeAttributeDataDimensionConfig>
  ) {
    super();
    this.valueType = 'quantitative';
    this.binType = 'equal value ranges';
    this.colorScale = scaleQuantize;
    this.interpolator = interpolateLab;
    this.numBins = 5;
    Object.assign(this, init);
  }
}

export class EqualNumbersQuantitativeAttributeDataDimensionConfig extends AttributeDataDimensionConfig {
  override domain: never;
  constructor(
    init?: Partial<EqualNumbersQuantitativeAttributeDataDimensionConfig>
  ) {
    super();
    this.valueType = 'quantitative';
    this.binType = 'equal num observations';
    this.colorScale = scaleQuantile;
    this.interpolator = interpolateLab;
    this.numBins = 5;
    Object.assign(this, init);
  }
}

export class CustomBreaksQuantitativeAttributeDataDimensionConfig extends AttributeDataDimensionConfig {
  constructor(
    init?: Partial<CustomBreaksQuantitativeAttributeDataDimensionConfig>
  ) {
    super();
    this.valueType = 'quantitative';
    this.binType = 'custom breaks';
    this.colorScale = scaleThreshold;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
  }
}
