import {
  ScaleBand,
  ScaleContinuousNumeric,
  ScaleTime,
  scaleBand,
  scaleLinear,
  scaleUtc,
} from 'd3';
import { VicFormatSpecifier } from '../value-format/value-format';
import { VicDomainPaddingConfig } from './data-domain-padding';

export enum VicDimension {
  'quantitative' = 'quantitative',
  'categorical' = 'categorical',
  'ordinal' = 'ordinal',
  'date' = 'date',
}

export type VicDataValue = number | string | Date;

export class VicDataDimensionConfig<Datum, ValueType> {
  valueAccessor: (d: Datum, ...args: any) => ValueType;
  domain?: ValueType[];
  valueFormat?: VicFormatSpecifier;
  constructor(init?: Partial<VicDataDimensionConfig<Datum, ValueType>>) {
    Object.assign(this, init);
  }
}

export class VicQuantitativeDimensionConfig<
  Datum
> extends VicDataDimensionConfig<Datum, number> {
  override domain?: [number, number];
  type: VicDimension.quantitative = VicDimension.quantitative;
  scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;
  domainPadding: VicDomainPaddingConfig;
  domainIncludesZero: boolean;

  constructor(init?: Partial<VicQuantitativeDimensionConfig<Datum>>) {
    super();
    this.scaleFn = scaleLinear;
    Object.assign(this, init);
  }
}

export class VicDateDimensionConfig<Datum> extends VicDataDimensionConfig<
  Datum,
  Date
> {
  override domain?: [Date, Date];
  type: VicDimension.date = VicDimension.date;
  domainPadding: never;
  domainIncludesZero: never;
  scaleFn: (
    domain?: Iterable<Date>,
    range?: Iterable<number>
  ) => ScaleTime<number, number>;

  constructor(init?: Partial<VicQuantitativeDimensionConfig<Datum>>) {
    super();
    this.scaleFn = scaleUtc as () => ScaleTime<number, number>;
    Object.assign(this, init);
  }
}

export class VicCategoricalColorDimensionConfig<
  Datum
> extends VicDataDimensionConfig<Datum, string> {
  colorScale?: (...args: any) => string;
  colors?: string[];
  constructor(init?: Partial<VicCategoricalColorDimensionConfig<Datum>>) {
    super();
    Object.assign(this, init);
  }
}

export class VicOrdinalDimensionConfig<
  Datum,
  TVicDataValue
> extends VicDataDimensionConfig<Datum, TVicDataValue> {
  type: VicDimension.ordinal = VicDimension.ordinal;
  scaleFn: (
    domain?: Iterable<TVicDataValue>,
    range?: Iterable<number>
  ) => ScaleBand<TVicDataValue>;
  paddingInner: number;
  paddingOuter: number;
  align: number;

  constructor(init?: Partial<VicOrdinalDimensionConfig<Datum, TVicDataValue>>) {
    super();
    this.scaleFn = scaleBand;
    this.paddingInner = 0.1;
    this.paddingOuter = 0.1;
    this.align = 0.5;
    Object.assign(this, init);
  }
}
