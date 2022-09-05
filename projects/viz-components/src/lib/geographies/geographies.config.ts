import {
  geoAlbersUsa,
  interpolateLab,
  scaleLinear,
  scaleQuantile,
  scaleQuantize,
  scaleThreshold,
} from 'd3';
import { DataDimensionConfig } from '../data-marks/data-dimension.config';
import { DataMarksConfig } from '../data-marks/data-marks.config';

export class GeographiesConfig extends DataMarksConfig {
  boundary: any;
  projection: any;
  noDataGeographiesConfigs?: NoDataGeographyConfig[];
  dataGeographyConfig?: DataGeographyConfig;

  constructor(init?: Partial<GeographiesConfig>) {
    super();
    this.data = [];
    this.projection = geoAlbersUsa();
    Object.assign(this, init);
  }
}

export class NoDataGeographyConfig {
  geographies: any[];
  strokeColor: string;
  strokeWidth: string;
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
