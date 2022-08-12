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

  constructor(init?: Partial<MapConfig>) {
    super();
    this.data = [];
    this.projection = geoAlbersUsa();
    Object.assign(this, init);
  }
}

export class SimpleGeography {
  geographies: any[];
  strokeColor: string;
  strokeWidth: string;
  fill: string;

  constructor(init?: Partial<SimpleGeography>) {
    this.strokeColor = 'dimgray';
    this.strokeWidth = '1';
    this.fill = 'none';
    Object.assign(this, init);
  }
}

export class DataGeography extends SimpleGeography {
  valueAccessor?: (d: any) => any;
  dataConfig: GeoDataDimension;
  nullColor: string;

  constructor(init?: Partial<DataGeography>) {
    super();
    this.nullColor = '#dcdcdc';
    Object.assign(this, init);
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
  constructor(init?: Partial<GeoDataDimension>) {
    super();
    Object.assign(this, init);
  }
}

export type MapBinType =
  | 'none'
  | 'equal value ranges'
  | 'equal num observations'
  | 'custom breaks';

export class GeoCategoricalDataDimension extends GeoDataDimension {
  override interpolator: never;

  constructor(init?: Partial<GeoCategoricalDataDimension>) {
    super();
    this.valueType = 'categorical';
    this.binType = 'none';
    this.colors = ['white', 'lightslategray'];
    Object.assign(this, init);
  }
}

export class GeoNoBinsQuantitativeDataDimension extends GeoDataDimension {
  constructor(init?: Partial<GeoNoBinsQuantitativeDataDimension>) {
    super();
    this.valueType = 'quantitative';
    this.binType = 'none';
    this.colorScale = scaleLinear;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
  }
}

export class GeoEqualValuesQuantitativeDataDimension extends GeoDataDimension {
  constructor(init?: Partial<GeoEqualValuesQuantitativeDataDimension>) {
    super();
    this.valueType = 'quantitative';
    this.binType = 'equal value ranges';
    this.colorScale = scaleQuantize;
    this.interpolator = interpolateLab;
    this.numBins = 5;
    Object.assign(this, init);
  }
}

export class GeoEqualNumbersQuantitativeDataDimension extends GeoDataDimension {
  constructor(init?: Partial<GeoEqualNumbersQuantitativeDataDimension>) {
    super();
    this.valueType = 'quantitative';
    this.binType = 'equal num observations';
    this.colorScale = scaleQuantile;
    this.interpolator = interpolateLab;
    this.numBins = 5;
    Object.assign(this, init);
  }
}

export class GeoCustomBreaksQuantitativeDataDimension extends GeoDataDimension {
  constructor(init?: Partial<GeoCustomBreaksQuantitativeDataDimension>) {
    super();
    this.valueType = 'quantitative';
    this.binType = 'custom breaks';
    this.colorScale = scaleThreshold;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
  }
}

export class MapDataValues {
  dataGeographies: any[];
  dataValues: any[];
  indexMap: InternMap;
  geoGeographies: any[];
  constructor(init?: Partial<MapDataValues>) {
    Object.assign(this, init);
  }
}
