import {
  geoAlbersUsa,
  InternMap,
  interpolateLab,
  scaleLinear,
  scaleQuantile,
  scaleQuantize,
  scaleThreshold,
} from 'd3';
import { DataDimension } from '../data-marks/data-dimension.model';
import { DataMarksConfig } from '../data-marks/data-marks.model';

export class GeographiesConfig extends DataMarksConfig {
  boundary: any;
  projection: any;
  noDataGeographies?: NoDataGeography[];
  dataGeography?: DataGeography;

  constructor() {
    super();
    this.data = [];
    this.projection = geoAlbersUsa();
  }
}

export class NoDataGeography {
  geographies: any[];
  strokeColor: string;
  strokeWidth: string;
  fill: string;

  constructor() {
    this.strokeColor = 'dimgray';
    this.strokeWidth = '1';
    this.fill = 'none';
  }
}

export class DataGeography extends NoDataGeography {
  valueAccessor?: (d: any) => any;
  attributeDataConfig: AttributeDataDimension;
  nullColor: string;

  constructor() {
    super();
    this.nullColor = '#dcdcdc';
  }
}

export class AttributeDataDimension extends DataDimension {
  geoAccessor: (d: any) => any;
  valueType: string;
  binType: MapBinType;
  range: any[];
  colorScale: (...args: any) => any;
  colors?: string[];
  numBins?: number;
  breakValues?: number[];
  interpolator: (...args: any) => any;
}

export type MapBinType =
  | 'none'
  | 'equal value ranges'
  | 'equal num observations'
  | 'custom breaks';

export class CategoricalAttributeDataDimension extends AttributeDataDimension {
  override interpolator: never;

  constructor() {
    super();
    this.valueType = 'categorical';
    this.binType = 'none';
    this.colors = ['white', 'lightslategray'];
  }
}

export class NoBinsQuantitativeAttributeDataDimension extends AttributeDataDimension {
  constructor() {
    super();
    this.valueType = 'quantitative';
    this.binType = 'none';
    this.colorScale = scaleLinear;
    this.interpolator = interpolateLab;
  }
}

export class EqualValuesQuantitativeAttributeDataDimension extends AttributeDataDimension {
  constructor() {
    super();
    this.valueType = 'quantitative';
    this.binType = 'equal value ranges';
    this.colorScale = scaleQuantize;
    this.interpolator = interpolateLab;
    this.numBins = 5;
  }
}

export class EqualNumbersQuantitativeAttributeDataDimension extends AttributeDataDimension {
  constructor() {
    super();
    this.valueType = 'quantitative';
    this.binType = 'equal num observations';
    this.colorScale = scaleQuantile;
    this.interpolator = interpolateLab;
    this.numBins = 5;
  }
}

export class CustomBreaksQuantitativeAttributeDataDimension extends AttributeDataDimension {
  constructor() {
    super();
    this.valueType = 'quantitative';
    this.binType = 'custom breaks';
    this.colorScale = scaleThreshold;
    this.interpolator = interpolateLab;
  }
}

export class MapDataValues {
  attributeDataGeographies: any[];
  attributeDataValues: any[];
  indexMap: InternMap;
  geoJsonGeographies: any[];
}
