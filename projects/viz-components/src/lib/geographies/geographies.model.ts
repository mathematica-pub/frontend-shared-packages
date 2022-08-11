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

  constructor(init?: Partial<GeographiesConfig>) {
    super();
    this.data = [];
    this.projection = geoAlbersUsa();
    Object.assign(this, init);
  }
}

export class NoDataGeography {
  geographies: any[];
  strokeColor: string;
  strokeWidth: string;
  fill: string;

  constructor(init?: Partial<NoDataGeography>) {
    this.strokeColor = 'dimgray';
    this.strokeWidth = '1';
    this.fill = 'none';
    Object.assign(this, init);
  }
}

export class DataGeography extends NoDataGeography {
  valueAccessor?: (d: any) => any;
  attributeDataConfig: AttributeDataDimension;
  nullColor: string;

  constructor(init?: Partial<DataGeography>) {
    super();
    this.nullColor = '#dcdcdc';
    Object.assign(this, init);
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
  constructor(init?: Partial<AttributeDataDimension>) {
    super();
    Object.assign(this, init);
  }
}

export type MapBinType =
  | 'none'
  | 'equal value ranges'
  | 'equal num observations'
  | 'custom breaks';

export class CategoricalAttributeDataDimension extends AttributeDataDimension {
  override interpolator: never;

  constructor(init?: Partial<CategoricalAttributeDataDimension>) {
    super();
    this.valueType = 'categorical';
    this.binType = 'none';
    this.colors = ['white', 'lightslategray'];
    Object.assign(this, init);
  }
}
export class NoBinsQuantitativeAttributeDataDimension extends AttributeDataDimension {
  constructor(init?: Partial<NoBinsQuantitativeAttributeDataDimension>) {
    super();
    this.valueType = 'quantitative';
    this.binType = 'none';
    this.colorScale = scaleLinear;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
  }
}

export class EqualValuesQuantitativeAttributeDataDimension extends AttributeDataDimension {
  constructor(init?: Partial<EqualValuesQuantitativeAttributeDataDimension>) {
    super();
    this.valueType = 'quantitative';
    this.binType = 'equal value ranges';
    this.colorScale = scaleQuantize;
    this.interpolator = interpolateLab;
    this.numBins = 5;
    Object.assign(this, init);
  }
}

export class EqualNumbersQuantitativeAttributeDataDimension extends AttributeDataDimension {
  constructor(init?: Partial<EqualNumbersQuantitativeAttributeDataDimension>) {
    super();
    this.valueType = 'quantitative';
    this.binType = 'equal num observations';
    this.colorScale = scaleQuantile;
    this.interpolator = interpolateLab;
    this.numBins = 5;
    Object.assign(this, init);
  }
}

export class CustomBreaksQuantitativeAttributeDataDimension extends AttributeDataDimension {
  constructor(init?: Partial<CustomBreaksQuantitativeAttributeDataDimension>) {
    super();
    this.valueType = 'quantitative';
    this.binType = 'custom breaks';
    this.colorScale = scaleThreshold;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
  }
}

export class MapDataValues {
  attributeDataGeographies: any[];
  attributeDataValues: any[];
  indexMap: InternMap;
  geoJsonGeographies: any[];

  constructor(init?: Partial<MapDataValues>) {
    Object.assign(this, init);
  }
}
