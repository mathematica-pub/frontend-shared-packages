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

export class MapConfig extends DataMarksConfig {
  boundary: any;
  projection: any;
  simpleGeographies?: SimpleGeography[];
  dataGeography?: DataGeography;

  constructor() {
    super();
    this.data = [];
    this.projection = geoAlbersUsa();
  }
}

export class SimpleGeography {
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

export class DataGeography extends SimpleGeography {
  valueAccessor?: (d: any) => any;
  dataConfig: GeoDataDimension;
  nullColor: string;

  constructor() {
    super();
    this.nullColor = '#dcdcdc';
  }
}

export class GeoDataDimension extends DataDimension {
  geoAccessor: (d: any) => any;
  valueType: string;
  binType: MapBinType;
  colorScale: (...args: any) => any;
  colors?: string[];
  numBins?: number;
  breakValues?: number[];
  interpolator: (...args: any) => any;
  range: any[];
}

export type MapBinType =
  | 'none'
  | 'equal value ranges'
  | 'equal num observations'
  | 'custom breaks';

export class GeoCategoricalDataDimension extends GeoDataDimension {
  override interpolator: never;

  constructor() {
    super();
    this.valueType = 'categorical';
    this.binType = 'none';
    this.colors = ['white', 'lightslategray'];
  }
}

export class GeoNoBinsQuantitativeDataDimension extends GeoDataDimension {
  constructor() {
    super();
    this.valueType = 'quantitative';
    this.binType = 'none';
    this.colorScale = scaleLinear;
    this.interpolator = interpolateLab;
  }
}

export class GeoEqualValuesQuantitativeDataDimension extends GeoDataDimension {
  constructor() {
    super();
    this.valueType = 'quantitative';
    this.binType = 'equal value ranges';
    this.colorScale = scaleQuantize;
    this.interpolator = interpolateLab;
    this.numBins = 5;
  }
}

export class GeoEqualNumbersQuantitativeDataDimension extends GeoDataDimension {
  constructor() {
    super();
    this.valueType = 'quantitative';
    this.binType = 'equal num observations';
    this.colorScale = scaleQuantile;
    this.interpolator = interpolateLab;
    this.numBins = 5;
  }
}

export class GeoCustomBreaksQuantitativeDataDimension extends GeoDataDimension {
  constructor() {
    super();
    this.valueType = 'quantitative';
    this.binType = 'custom breaks';
    this.colorScale = scaleThreshold;
    this.interpolator = interpolateLab;
  }
}

export class MapDataValues {
  dataGeographies: any[];
  dataValues: any[];
  indexMap: InternMap;
  geoGeographies: any[];
}
