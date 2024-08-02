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

export class VicDataDimensionConfig<Datum> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueAccessor: (d: Datum, ...args: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  domain?: any;
  valueFormat?: VicFormatSpecifier;
  constructor(init?: Partial<VicDataDimensionConfig<Datum>>) {
    Object.assign(this, init);
  }
}

export class VicQuantitativeDimensionConfig<
  Datum,
> extends VicDataDimensionConfig<Datum> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override valueAccessor: (d: Datum, ...args: any) => number;
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
    this.domainIncludesZero = true;
    Object.assign(this, init);
  }
}

export class VicDateDimensionConfig<
  Datum,
> extends VicDataDimensionConfig<Datum> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override valueAccessor: (d: Datum, ...args: any) => Date;
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
  Datum,
> extends VicDataDimensionConfig<Datum> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override domain?: any[] | InternSet;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  colorScale?: (...args: any) => any;
  colors?: string[];
  constructor(init?: Partial<VicCategoricalColorDimensionConfig<Datum>>) {
    super();
    Object.assign(this, init);
  }
}

export class VicOrdinalDimensionConfig<
  Datum,
> extends VicDataDimensionConfig<Datum> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override domain?: any[] | InternSet;
  type: VicDimension.ordinal = VicDimension.ordinal;
  scaleFn: (
    domain?: Iterable<string>,
    range?: Iterable<number>
  ) => ScaleBand<string>;
  paddingInner: number;
  paddingOuter: number;
  align: number;

  constructor(init?: Partial<VicOrdinalDimensionConfig<Datum>>) {
    super();
    this.scaleFn = scaleBand;
    this.paddingInner = 0.1;
    this.paddingOuter = 0.1;
    this.align = 0.5;
    Object.assign(this, init);
  }
}

export enum DomainPadding {
  roundUp = 'roundUp',
  roundInterval = 'roundInterval',
  percentOver = 'percentOver',
  numPixels = 'numPixels',
}

export type VicDomainPaddingConfig =
  | VicRoundUpDomainPaddingConfig
  | VicRoundUpToIntervalDomainPaddingConfig
  | VicPercentOverDomainPaddingConfig
  | VicPixelDomainPaddingConfig;

export class VicRoundUpDomainPaddingConfig {
  type: DomainPadding.roundUp = DomainPadding.roundUp;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sigDigits: (d: any) => number;

  constructor(init?: Partial<VicRoundUpDomainPaddingConfig>) {
    this.sigDigits = () => 1;
    Object.assign(this, init);
  }
}

export class VicRoundUpToIntervalDomainPaddingConfig {
  type: DomainPadding.roundInterval = DomainPadding.roundInterval;
  interval: (maxValue: number) => number;

  constructor(init?: Partial<VicRoundUpToIntervalDomainPaddingConfig>) {
    this.interval = () => 1;
    Object.assign(this, init);
  }
}

export class VicPercentOverDomainPaddingConfig {
  type: DomainPadding.percentOver = DomainPadding.percentOver;
  percentOver: number;

  constructor(init?: Partial<VicPercentOverDomainPaddingConfig>) {
    this.percentOver = 0.1;
    Object.assign(this, init);
  }
}

export class VicPixelDomainPaddingConfig {
  type: DomainPadding.numPixels = DomainPadding.numPixels;
  numPixels: number;

  constructor(init?: Partial<VicPixelDomainPaddingConfig>) {
    this.numPixels = 40;
    Object.assign(this, init);
  }
}
