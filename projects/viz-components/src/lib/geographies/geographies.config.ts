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
import { Feature } from 'geojson';
import { VicDataDimensionConfig as VicDataDimensionConfig } from '../data-marks/data-dimension.config';
import {
  VicDataMarksConfig as VicDataMarksConfig,
  VicPatternPredicate as VicPatternPredicate,
} from '../data-marks/data-marks.config';

/** Primary configuration object to specify a map with attribute data, intended to be used with GeographiesComponent.
 * Note that while a GeographiesComponent can create geographies without attribute data, for example, to create an
 * outline of a geographic area, it is not intended to draw maps that have no attribute data.
 */
export class VicGeographiesConfig extends VicDataMarksConfig {
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
  noDataGeographiesConfigs?: VicNoDataGeographyConfig[];
  /**
   * A configuration object that pertains to geographies that have attribute data, for example, states in the US each of which have a value for % unemployment.
   */
  dataGeographyConfig: VicDataGeographyConfig;

  constructor(init?: Partial<VicGeographiesConfig>) {
    super();
    this.projection = geoAlbersUsa();
    Object.assign(this, init);
  }
}

export class VicBaseDataGeographyConfig {
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
}

export class VicNoDataGeographyConfig extends VicBaseDataGeographyConfig {
  /**
   * The pattern for noDataGeography. If provided, fill will be overridden.
   */
  patternName: string;

  constructor(init?: Partial<VicNoDataGeographyConfig>) {
    super();
    this.strokeColor = 'dimgray';
    this.strokeWidth = '1';
    this.fill = 'none';
    Object.assign(this, init);
  }
}

export class VicDataGeographyConfig extends VicBaseDataGeographyConfig {
  valueAccessor?: (d: any) => any;
  attributeDataConfig: VicAttributeDataDimensionConfig;
  nullColor: string;

  constructor(init?: Partial<VicDataGeographyConfig>) {
    super();
    this.nullColor = '#dcdcdc';
    Object.assign(this, init);
  }
}

export class VicAttributeDataDimensionConfig extends VicDataDimensionConfig {
  geoAccessor: (d: any) => any;
  valueType: string;
  binType: VicMapBinType;
  range: any[];
  colorScale: (...args: any) => any;
  colors?: string[];
  numBins?: number;
  breakValues?: number[];
  interpolator: (...args: any) => any;
  patternPredicates?: VicPatternPredicate[];
  constructor(init?: Partial<VicAttributeDataDimensionConfig>) {
    super();
    Object.assign(this, init);
  }
}

export type VicMapBinType =
  | 'none'
  | 'equal value ranges'
  | 'equal num observations'
  | 'custom breaks';

export class VicCategoricalAttributeDataDimensionConfig extends VicAttributeDataDimensionConfig {
  override interpolator: never;

  constructor(init?: Partial<VicCategoricalAttributeDataDimensionConfig>) {
    super();
    this.valueType = 'categorical';
    this.binType = 'none';
    this.colorScale = scaleOrdinal;
    this.colors = ['white', 'lightslategray'];
    Object.assign(this, init);
  }
}
export class VicNoBinsQuantitativeAttributeDataDimensionConfig extends VicAttributeDataDimensionConfig {
  constructor(
    init?: Partial<VicNoBinsQuantitativeAttributeDataDimensionConfig>
  ) {
    super();
    this.valueType = 'quantitative';
    this.binType = 'none';
    this.colorScale = scaleLinear;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
  }
}

export class VicEqualValuesQuantitativeAttributeDataDimensionConfig extends VicAttributeDataDimensionConfig {
  constructor(
    init?: Partial<VicEqualValuesQuantitativeAttributeDataDimensionConfig>
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

export class VicEqualNumbersQuantitativeAttributeDataDimensionConfig extends VicAttributeDataDimensionConfig {
  override domain: never;
  constructor(
    init?: Partial<VicEqualNumbersQuantitativeAttributeDataDimensionConfig>
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

export class VicCustomBreaksQuantitativeAttributeDataDimensionConfig extends VicAttributeDataDimensionConfig {
  constructor(
    init?: Partial<VicCustomBreaksQuantitativeAttributeDataDimensionConfig>
  ) {
    super();
    this.valueType = 'quantitative';
    this.binType = 'custom breaks';
    this.colorScale = scaleThreshold;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
  }
}
