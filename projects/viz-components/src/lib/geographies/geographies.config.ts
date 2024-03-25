import type * as CSSType from 'csstype';
import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  ExtendedGeometryCollection,
  geoAlbersUsa,
  GeoGeometryObjects,
  GeoPath,
  GeoProjection,
  interpolateLab,
  ScaleLinear,
  scaleLinear,
  scaleOrdinal,
  scaleQuantile,
  scaleQuantize,
  scaleThreshold,
} from 'd3';
import {
  Feature,
  GeoJsonProperties,
  GeometryObject as Geometry,
  MultiPolygon,
  Polygon,
} from 'geojson';
import { VicVariableType } from '../core/types/variable-type';
import { VicDataDimensionConfig } from '../data-marks/data-dimension.config';
import {
  VicDataMarksConfig,
  VicPatternPredicate,
} from '../data-marks/data-marks.config';
import { VicGeographiesLabelsAutoColor } from './geographies-labels-fill-weight.class';
import { positionAtCentroid } from './geographies-labels-positioners';
/** Primary configuration object to specify a map with attribute data, intended to be used with GeographiesComponent.
 * Note that while a GeographiesComponent can create geographies without attribute data, for example, to create an
 * outline of a geographic area, it is not intended to draw maps that have no attribute data.
 */

export type GeographiesFeature<
  P extends GeoJsonProperties = GeoJsonProperties,
  G extends Geometry = MultiPolygon | Polygon
> = Feature<G, P>;

export class VicGeographiesConfig<
  Datum,
  P extends GeoJsonProperties = GeoJsonProperties,
  G extends Geometry = MultiPolygon | Polygon
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
  featureIndexAccessor?: (d: GeographiesFeature<P, G>) => string | number;
  /**
   * A configuration object that pertains to geographies that a user wants to draw without attribute data, for example the outline of a country.
   */
  noDataGeographiesConfigs?: VicNoDataGeographyConfig<Datum, P, G>[];
  /**
   * A configuration object that pertains to geographies that have attribute data, for example, states in the US each of which have a value for % unemployment.
   */
  dataGeographyConfig: VicDataGeographyConfig<Datum, P, G>;

  constructor(init?: Partial<VicGeographiesConfig<Datum, P, G>>) {
    super();
    this.projection = geoAlbersUsa();
    Object.assign(this, init);
  }
}

export type VicGeoJsonDefaultProperty = { [name: string]: any };

export class VicBaseDataGeographyConfig<
  Datum,
  P,
  G extends Geometry,
  Projection
> {
  /**
   * GeoJSON features that define the geographies to be drawn.
   */
  geographies: Array<GeographiesFeature<P, G>>;
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
  labels: VicGeographyLabelConfig<Datum, P, G, Projection>;
}

export class VicDataGeographyConfig<
  Datum,
  P,
  G extends Geometry,
  Projection = GeoProjection
> extends VicBaseDataGeographyConfig<Datum, P, G, Projection> {
  attributeDataConfig: VicAttributeDataDimensionConfig<Datum>;
  nullColor: string;

  constructor(init?: Partial<VicDataGeographyConfig<Datum, P, G, Projection>>) {
    super();
    this.nullColor = '#dcdcdc';
    this.strokeColor = 'dimgray';
    this.strokeWidth = '1';
    Object.assign(this, init);
  }
}

export class VicAttributeDataDimensionConfig<
  Datum
> extends VicDataDimensionConfig<Datum> {
  geoAccessor: (d: Datum, ...args: any) => any;
  variableType: VicVariableType.categorical | VicVariableType.quantitative;
  binType: keyof typeof VicValuesBin;
  range: any[];
  colorScale: (...args: any) => any;
  colors?: string[];
  numBins?: number;
  breakValues?: number[];
  interpolator: (...args: any) => any;
  patternPredicates?: VicPatternPredicate[];
  constructor(init?: Partial<VicAttributeDataDimensionConfig<Datum>>) {
    super();
    Object.assign(this, init);
  }
}

export enum VicValuesBin {
  none = 'none',
  equalValueRanges = 'equalValueRanges',
  equalNumObservations = 'equalNumObservations',
  customBreaks = 'customBreaks',
}

export class VicCategoricalAttributeDataDimensionConfig<
  Datum
> extends VicAttributeDataDimensionConfig<Datum> {
  override interpolator: never;

  constructor(
    init?: Partial<VicCategoricalAttributeDataDimensionConfig<Datum>>
  ) {
    super();
    this.variableType = VicVariableType.categorical;
    this.binType = VicValuesBin.none;
    this.colorScale = scaleOrdinal;
    this.colors = ['white', 'lightslategray'];
    Object.assign(this, init);
  }
}
export class VicNoBinsQuantitativeAttributeDataDimensionConfig<
  Datum
> extends VicAttributeDataDimensionConfig<Datum> {
  constructor(
    init?: Partial<VicNoBinsQuantitativeAttributeDataDimensionConfig<Datum>>
  ) {
    super();
    this.variableType = VicVariableType.quantitative;
    this.binType = VicValuesBin.none;
    this.colorScale = scaleLinear;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
  }
}

export class VicEqualValuesQuantitativeAttributeDataDimensionConfig<
  Datum
> extends VicAttributeDataDimensionConfig<Datum> {
  constructor(
    init?: Partial<
      VicEqualValuesQuantitativeAttributeDataDimensionConfig<Datum>
    >
  ) {
    super();
    this.variableType = VicVariableType.quantitative;
    this.binType = VicValuesBin.equalValueRanges;
    this.colorScale = scaleQuantize;
    this.interpolator = interpolateLab;
    this.numBins = 5;
    Object.assign(this, init);
  }
}

export class VicEqualNumbersQuantitativeAttributeDataDimensionConfig<
  Datum
> extends VicAttributeDataDimensionConfig<Datum> {
  override domain: never;
  constructor(
    init?: Partial<
      VicEqualNumbersQuantitativeAttributeDataDimensionConfig<Datum>
    >
  ) {
    super();
    this.variableType = VicVariableType.quantitative;
    this.binType = VicValuesBin.equalNumObservations;
    this.colorScale = scaleQuantile;
    this.interpolator = interpolateLab;
    this.numBins = 5;
    Object.assign(this, init);
  }
}

export class VicCustomBreaksQuantitativeAttributeDataDimensionConfig<
  Datum
> extends VicAttributeDataDimensionConfig<Datum> {
  constructor(
    init?: Partial<
      VicCustomBreaksQuantitativeAttributeDataDimensionConfig<Datum>
    >
  ) {
    super();
    this.variableType = VicVariableType.quantitative;
    this.binType = VicValuesBin.customBreaks;
    this.colorScale = scaleThreshold;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
  }
}

export class VicNoDataGeographyConfig<
  Datum,
  P,
  G extends Geometry,
  Projection = GeoProjection
> extends VicBaseDataGeographyConfig<Datum, P, G, Projection> {
  /**
   * The pattern for noDataGeography. If provided, fill will be overridden.
   */
  patternName: ((d: GeographiesFeature<P, G>) => string) | string;

  constructor(
    init?: Partial<VicNoDataGeographyConfig<Datum, P, G, Projection>>
  ) {
    super();
    this.strokeColor = 'dimgray';
    this.strokeWidth = '1';
    this.fill = 'none';
    Object.assign(this, init);
  }
}

export interface LabelPosition {
  x: number;
  y: number;
}

/**
 * Configuration object for labels to be shown on the map. Label functions depend on
 * geojon features.
 */
export class VicGeographyLabelConfig<
  Datum,
  P,
  G extends Geometry,
  Projection = GeoProjection
> {
  /**
   * Function that determines whether a label should be shown on the GeoJSON feature
   * Exists because it's common for small geographies to not have labels shown on them.
   */
  display: (d: GeographiesFeature<P, G>, ...args: any) => boolean;
  /**
   * Function that maps a geojson feature to the desired label
   */
  valueAccessor: (d: GeographiesFeature<P, G>) => string;
  textAnchor: CSSType.Property.TextAnchor;
  alignmentBaseline: CSSType.Property.AlignmentBaseline;
  dominantBaseline: CSSType.Property.DominantBaseline;
  cursor: CSSType.Property.Cursor;
  pointerEvents: CSSType.Property.PointerEvents;
  fontWeight:
    | ((d: Datum) => CSSType.Property.FontWeight)
    | CSSType.Property.FontWeight;
  color: ((d: Datum) => CSSType.Property.Fill) | CSSType.Property.Fill;
  position: (
    d: GeographiesFeature<P, G>,
    path: GeoPath,
    projection: Projection
  ) => LabelPosition;

  autoColorByContrast: VicGeographiesLabelsAutoColor;
  fontScale: ScaleLinear<number, number, never>;

  constructor(
    init?: Partial<VicGeographyLabelConfig<Datum, P, G, Projection>>
  ) {
    this.display = () => true;
    this.color = '#000';
    this.fontWeight = 400;
    this.position = (d, path) => positionAtCentroid<P, G>(d, path);
    this.fontScale = scaleLinear().domain([0, 800]).range([0, 17]);
    this.textAnchor = 'middle';
    this.alignmentBaseline = 'middle';
    this.dominantBaseline = 'middle';
    this.cursor = 'default';
    this.pointerEvents = 'none';
    Object.assign(this, init);
  }
}
