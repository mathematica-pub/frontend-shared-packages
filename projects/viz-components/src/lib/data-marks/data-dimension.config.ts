import { InternSet, scaleBand } from 'd3';
import { FormatSpecifier } from '../value-format/value-format';

export class DataDimensionConfig {
  valueAccessor: (...args: any) => any;
  domain?: any;
  valueFormat?: FormatSpecifier;
  constructor(init?: Partial<DataDimensionConfig>) {
    Object.assign(this, init);
  }
}

export class QuantitativeDimensionConfig extends DataDimensionConfig {
  override domain?: [any, any];
  scaleType?: (d: any, r: any) => any;
  domainPadding: DomainPaddingConfig;

  constructor(init?: Partial<QuantitativeDimensionConfig>) {
    super();
    Object.assign(this, init);
  }
}

export enum DomainPadding {
  roundUp = 'roundUp',
  roundInterval = 'roundInterval',
  percentOver = 'percentOver',
  numPixels = 'numPixels',
}

export class BaseDomainPaddingConfig {
  sigDigits: (d: any) => number;
  constructor(init?: Partial<BaseDomainPaddingConfig>) {
    this.sigDigits = () => 1;
    Object.assign(this, init);
  }
}

export class RoundUpDomainPaddingConfig extends BaseDomainPaddingConfig {
  type: DomainPadding.roundUp;

  constructor(init?: Partial<RoundUpDomainPaddingConfig>) {
    super();
    Object.assign(this, init);
  }
}

export class RoundUpToIntervalDomainPaddingConfig extends BaseDomainPaddingConfig {
  type: DomainPadding.roundInterval;
  interval: (maxValue: number) => number;

  constructor(init?: Partial<RoundUpToIntervalDomainPaddingConfig>) {
    super();
    this.interval = () => 1;
    Object.assign(this, init);
  }
}

export class PercentOverDomainPaddingConfig extends BaseDomainPaddingConfig {
  type: DomainPadding.percentOver;
  percentOver: number;

  constructor(init?: Partial<PercentOverDomainPaddingConfig>) {
    super();
    this.percentOver = 0.1;
    Object.assign(this, init);
  }
}

export class PixelDomainPaddingConfig extends BaseDomainPaddingConfig {
  type: DomainPadding.numPixels;
  numPixels: number;

  constructor(init?: Partial<PixelDomainPaddingConfig>) {
    super();
    this.numPixels = 40;
    Object.assign(this, init);
  }
}

export type DomainPaddingConfig =
  | RoundUpDomainPaddingConfig
  | RoundUpToIntervalDomainPaddingConfig
  | PercentOverDomainPaddingConfig
  | PixelDomainPaddingConfig;

export class CategoricalColorDimensionConfig extends DataDimensionConfig {
  override domain?: any[] | InternSet;
  colorScale?: (...args: any) => any;
  colors?: string[];
  constructor(init?: Partial<CategoricalColorDimensionConfig>) {
    super();
    Object.assign(this, init);
  }
}

export class OrdinalDimensionConfig extends DataDimensionConfig {
  override domain?: any[] | InternSet;
  scaleType: (d: any, r: any) => any;
  paddingInner: number;
  paddingOuter: number;
  align: number;

  constructor(init?: Partial<OrdinalDimensionConfig>) {
    super();
    this.scaleType = scaleBand;
    this.paddingInner = 0.1;
    this.paddingOuter = 0.1;
    this.align = 0.5;
    Object.assign(this, init);
  }
}
