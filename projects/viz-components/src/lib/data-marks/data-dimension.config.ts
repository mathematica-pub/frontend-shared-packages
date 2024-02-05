import {
  InternSet,
  ScaleBand,
  ScaleContinuousNumeric,
  ScaleTime,
  scaleBand,
  scaleLinear,
  scaleUtc,
} from 'd3';
import { VicFormatSpecifier } from '../value-format/value-format';

export enum VicDimension {
  'quantitative' = 'quantitative',
  'categorical' = 'categorical',
  'ordinal' = 'ordinal',
  'date' = 'date',
}

export class VicDataDimensionConfig<T> {
  valueAccessor: (d: T, ...args: any) => any;
  domain?: any;
  valueFormat?: VicFormatSpecifier;
  constructor(init?: Partial<VicDataDimensionConfig<T>>) {
    Object.assign(this, init);
  }
}

export class VicQuantitativeDimensionConfig<
  T
> extends VicDataDimensionConfig<T> {
  override valueAccessor: (d: T, ...args: any) => number;
  override domain?: [number, number];
  type: VicDimension.quantitative = VicDimension.quantitative;
  scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;
  domainPadding: VicDomainPaddingConfig;
  domainIncludesZero: boolean;

  constructor(init?: Partial<VicQuantitativeDimensionConfig<T>>) {
    super();
    this.scaleFn = scaleLinear;
    Object.assign(this, init);
  }
}

export class VicDateDimensionConfig<T> extends VicDataDimensionConfig<T> {
  override valueAccessor: (d: T, ...args: any) => Date;
  override domain?: [Date, Date];
  type: VicDimension.date = VicDimension.date;
  domainPadding: never;
  domainIncludesZero: never;

  scaleFn: (
    domain?: Iterable<Date>,
    range?: Iterable<number>
  ) => ScaleTime<number, number>;

  constructor(init?: Partial<VicQuantitativeDimensionConfig<T>>) {
    super();
    this.scaleFn = scaleUtc as () => ScaleTime<number, number>;
    Object.assign(this, init);
  }
}

export enum DomainPadding {
  roundUp = 'roundUp',
  roundInterval = 'roundInterval',
  percentOver = 'percentOver',
  numPixels = 'numPixels',
}

export class VicBaseDomainPaddingConfig {
  sigDigits: (d: any) => number;
  constructor(init?: Partial<VicBaseDomainPaddingConfig>) {
    this.sigDigits = () => 1;
    Object.assign(this, init);
  }
}

export class VicRoundUpDomainPaddingConfig extends VicBaseDomainPaddingConfig {
  type: DomainPadding.roundUp = DomainPadding.roundUp;

  constructor(init?: Partial<VicRoundUpDomainPaddingConfig>) {
    super();
    Object.assign(this, init);
  }
}

export class VicRoundUpToIntervalDomainPaddingConfig extends VicBaseDomainPaddingConfig {
  type: DomainPadding.roundInterval = DomainPadding.roundInterval;
  interval: (maxValue: number) => number;

  constructor(init?: Partial<VicRoundUpToIntervalDomainPaddingConfig>) {
    super();
    this.interval = () => 1;
    Object.assign(this, init);
  }
}

export class VicPercentOverDomainPaddingConfig extends VicBaseDomainPaddingConfig {
  type: DomainPadding.percentOver = DomainPadding.percentOver;
  percentOver: number;

  constructor(init?: Partial<VicPercentOverDomainPaddingConfig>) {
    super();
    this.percentOver = 0.1;
    Object.assign(this, init);
  }
}

export class VicPixelDomainPaddingConfig extends VicBaseDomainPaddingConfig {
  type: DomainPadding.numPixels = DomainPadding.numPixels;
  numPixels: number;

  constructor(init?: Partial<VicPixelDomainPaddingConfig>) {
    super();
    this.numPixels = 40;
    Object.assign(this, init);
  }
}

export type VicDomainPaddingConfig =
  | VicRoundUpDomainPaddingConfig
  | VicRoundUpToIntervalDomainPaddingConfig
  | VicPercentOverDomainPaddingConfig
  | VicPixelDomainPaddingConfig;

export class VicCategoricalColorDimensionConfig<
  T
> extends VicDataDimensionConfig<T> {
  override domain?: any[] | InternSet;
  colorScale?: (...args: any) => any;
  colors?: string[];
  constructor(init?: Partial<VicCategoricalColorDimensionConfig<T>>) {
    super();
    Object.assign(this, init);
  }
}

export class VicOrdinalDimensionConfig<T> extends VicDataDimensionConfig<T> {
  override domain?: any[] | InternSet;
  type: VicDimension.ordinal = VicDimension.ordinal;
  scaleFn: (
    domain?: Iterable<string>,
    range?: Iterable<number>
  ) => ScaleBand<string>;
  paddingInner: number;
  paddingOuter: number;
  align: number;

  constructor(init?: Partial<VicOrdinalDimensionConfig<T>>) {
    super();
    this.scaleFn = scaleBand;
    this.paddingInner = 0.1;
    this.paddingOuter = 0.1;
    this.align = 0.5;
    Object.assign(this, init);
  }
}
