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
import { Feature, MultiPolygon } from 'geojson';
import { VicDataDimensionConfig } from '../data-marks/data-dimension.config';
import {
  VicDataMarksConfig,
  VicPatternPredicate,
} from '../data-marks/data-marks.config';
import type * as CSSType from 'csstype';
import { VicGeographiesUtils } from './geographies-utils.class';
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
  /**
   * VicGeographyLabelConfig that define the labels to be shown.
   * If not defined, no labels will be drawn.
   */
  labels: VicGeographyLabelConfig;
}

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

  textAnchor: CSSType.Property.TextAnchor;
  alignmentBaseline: CSSType.Property.AlignmentBaseline;
  dominantBaseline: CSSType.Property.DominantBaseline;
  cursor: CSSType.Property.Cursor;
  pointerEvents: CSSType.Property.PointerEvents;

  labelPositionFunction: (
    d: Feature<MultiPolygon, any>,
    path: GeoPath<any, GeoPermissibleObjects>,
    projection: any
  ) => [number, number] = (
    d: Feature<MultiPolygon, any>,
    path: GeoPath<any, GeoPermissibleObjects>
  ) => path.centroid(d);

  labelFillFunction: (
    d: Feature<MultiPolygon, any>,
    geographyFill: CSSType.Property.Fill
  ) => CSSType.Property.Fill;

  labelFontWeightFunction: (
    d: Feature<MultiPolygon, any>,
    geographyFill: CSSType.Property.Fill
  ) => CSSType.Property.FontWeight;
  /**
   * fontScale = scaleLinear().domain([smallestChartSize, largestChartSize]).range([smallestChartSize, largestFontSize])
   * font-size = fontScale(actualChartWidth)
   */
  fontScale: ScaleLinear<number, number, never>;

  /**
   * Fluent Interface Functions: https://samuelkollat.hashnode.dev/beyond-basics-streamline-your-typescript-code-with-fluent-interface-design-pattern
   *
   *
   * If the label is within the bounds of the geography (e.g. in the US, everything except HI), we check the contrast of
   * the light & dark color against the fill of the geography, and use the one that has the best contrast ratio. If the label is not in the
   * bounds of the geography, we use the dark text color.
   * DarkTextColor and LightTextColor must be in rgb notation
   */
  useBinaryLabelFill(
    options: {
      darkTextColor?: CSSType.Property.Fill;
      lightTextColor?: CSSType.Property.Fill;
      darkFontWeight?: CSSType.Property.FontWeight;
      lightFontWeight?: CSSType.Property.FontWeight;
    } = {
      darkTextColor: 'rgb(0,0,0)',
      lightTextColor: 'rgb(255,255,255)',
      darkFontWeight: 'bold',
      lightFontWeight: 'normal',
    }
  ): VicGeographyLabelConfig {
    this.labelFillFunction = (d, geographyFill) => {
      return VicGeographiesUtils.binaryLabelFill(
        d,
        geographyFill,
        options.lightTextColor,
        options.darkTextColor,
        this
      );
    };

    this.labelFontWeightFunction = (d, geographyFill) => {
      return VicGeographiesUtils.binaryLabelFontWeight(
        d,
        geographyFill,
        options.darkTextColor,
        options.lightTextColor,
        options.darkFontWeight,
        options.lightFontWeight,
        this
      );
    };
    return this;
  }

  constructor(init?: Partial<VicGeographyLabelConfig>) {
    this.fontScale = scaleLinear().domain([0, 800]).range([0, 17]);
    this.textAnchor = 'middle';
    this.alignmentBaseline = 'middle';
    this.dominantBaseline = 'middle';
    this.cursor = 'default';
    this.pointerEvents = 'none';
    Object.assign(this, init);
  }
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
