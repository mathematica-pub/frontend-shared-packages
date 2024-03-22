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
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { VicVariableType } from '../core/types/variable-type';
import { VicDataDimensionConfig } from '../data-marks/data-dimension.config';
import {
  VicDataMarksConfig,
  VicPatternPredicate,
} from '../data-marks/data-marks.config';

/** Primary configuration object to specify a map with attribute data, intended to be used with GeographiesComponent.
 * Note that while a GeographiesComponent can create geographies without attribute data, for example, to create an
 * outline of a geographic area, it is not intended to draw maps that have no attribute data.
 */
export class VicGeographiesConfig<
  Datum,
  SpecificGeoJsonProperties
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
   * A configuration object that pertains to geographies that have no attribute data, for example the outline of a country.
   */
  noDataGeographiesConfigs?: VicNoDataGeographyConfig[];
  /**
   * A configuration object that pertains to geographies that have attribute data, for example, states in the US each of which have a value for % unemployment.
   */
  dataGeographyConfig: VicDataGeographyConfig<Datum, SpecificGeoJsonProperties>;

  constructor(
    init?: Partial<VicGeographiesConfig<Datum, SpecificGeoJsonProperties>>
  ) {
    super();
    this.projection = geoAlbersUsa();
    Object.assign(this, init);
  }
}

export type VicGeoJsonDefaultProperty = { [name: string]: any };

export class VicBaseDataGeographyConfig<
  SpecificGeoJsonProperties extends GeoJsonProperties = GeoJsonProperties
> {
  /**
   * GeoJSON features that define the geographies to be drawn.
   */
  geographies: Feature<Geometry, SpecificGeoJsonProperties>[];
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

export class VicDataGeographyConfig<
  Datum,
  SpecificGeoJsonProperties
> extends VicBaseDataGeographyConfig<SpecificGeoJsonProperties> {
  /**
   * A function that derives the name or id of the geography from properties object on the geojson feature.
   */
  featureIndexAccessor?: (
    properties: SpecificGeoJsonProperties,
    ...args: any
  ) => string | number;
  attributeDataConfig: VicAttributeDataDimensionConfig<Datum>;
  nullColor: string;

  constructor(
    init?: Partial<VicDataGeographyConfig<Datum, SpecificGeoJsonProperties>>
  ) {
    super();
    this.nullColor = '#dcdcdc';
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
