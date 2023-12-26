import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  ExtendedGeometryCollection,
  geoAlbersUsa,
  GeoGeometryObjects,
  GeoPath,
  GeoPermissibleObjects,
  GeoProjection,
  interpolateLab,
  ScaleLinear,
  scaleLinear,
  scaleOrdinal,
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

export class BaseDataGeographyConfig {
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
  /**
   * VicGeographyLabelConfig that define the labels to be shown.
   * If not defined, no labels will be drawn.
   */
  labels: VicGeographyLabelConfig;
}

/**
 * Should the color contrast check be in a service that could be
 * reused for other visualization types? One example that comes to
 * mind, although I don't think it's currently in viz-components,
 * is dynamically setting the bar label color based on the ordinal
 * color scale in a grouped bar chart.
 */
export class VicGeographyLabelConfig {
  /**
   * Function that determines whether a label should be shown on the GeoJSON feature
   * Exists because it's common for small geographies to not have labels shown on them.
   */
  showLabelFunction: (d: Feature, i: number) => boolean = () => true;

  /**
   * Function that maps a feature to the desired label
   */
  labelTextFunction: (d: Feature) => string;

  /**
   * Under the hood, if the label is within the bounds of the geography (e.g. in the US, everything except HI), we check the contrast of
   * the light & dark color against the fill of the geography, and use the one that has the best contrast ratio. If the label is not in the
   * bounds of the geography, we use the dark text color.
   */
  darkTextColor: string;
  lightTextColor: string;

  darkTextWeight: string;
  lightTextWeight: string;

  labelPositionFunction: (
    d: Feature,
    path: GeoPath<any, GeoPermissibleObjects>
  ) => [number, number] = (
    d: Feature,
    path: GeoPath<any, GeoPermissibleObjects>
  ) => path.centroid(d);

  /**
   * behind the scenes, used in a font scale that is:
   * fontScale = scaleLinear().domain([0, largestChartSize]).range([0, largestFontSize])
   * font-size = fontScale(actualChartWidth)
   */
  fontScale: ScaleLinear<number, number, never> = scaleLinear()
    .domain([0, 800])
    .range([0, 17]);

  constructor(init?: Partial<VicGeographyLabelConfig>) {
    Object.assign(this, init);
  }
}
export class NoDataGeographyConfig extends BaseDataGeographyConfig {
  /**
   * The pattern for noDataGeography. If provided, fill will be overridden.
   */
  patternName: string;

  constructor(init?: Partial<NoDataGeographyConfig>) {
    super();
    this.strokeColor = 'dimgray';
    this.strokeWidth = '1';
    this.fill = 'none';
    Object.assign(this, init);
  }
}

export class DataGeographyConfig extends BaseDataGeographyConfig {
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
    this.colorScale = scaleOrdinal;
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
