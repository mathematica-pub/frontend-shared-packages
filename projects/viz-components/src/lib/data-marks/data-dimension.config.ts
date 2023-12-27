import { InternSet, scaleBand } from 'd3';
import { VicFormatSpecifier } from '../value-format/value-format';

export class VicDataDimensionConfig {
  valueAccessor: (...args: any) => any;
  domain?: any;
  valueFormat?: VicFormatSpecifier;
  constructor(init?: Partial<VicDataDimensionConfig>) {
    Object.assign(this, init);
  }
}

export class VicQuantitativeDimensionConfig extends VicDataDimensionConfig {
  override domain?: [any, any];
  scaleType?: (d: any, r: any) => any;
  domainPadding: VicDomainPaddingConfig;

  constructor(init?: Partial<VicQuantitativeDimensionConfig>) {
    super();
    Object.assign(this, init);
  }
}

export class VicBaseDomainPaddingConfig {
  sigDigits: (d: any) => number;
  constructor(init?: Partial<VicBaseDomainPaddingConfig>) {
    this.sigDigits = () => 1;
    Object.assign(this, init);
  }
}

export class VicRoundUpDomainPaddingConfig extends VicBaseDomainPaddingConfig {
  type: 'roundUp' = 'roundUp';

  constructor(init?: Partial<VicRoundUpDomainPaddingConfig>) {
    super();
    Object.assign(this, init);
  }
}

export class VicRoundUpToIntervalDomainPaddingConfig extends VicBaseDomainPaddingConfig {
  type: 'roundInterval' = 'roundInterval';
  interval: (maxValue: number) => number;

  constructor(init?: Partial<VicRoundUpToIntervalDomainPaddingConfig>) {
    super();
    this.interval = () => 1;
    Object.assign(this, init);
  }
}

export class VicPercentOverDomainPaddingConfig extends VicBaseDomainPaddingConfig {
  type: 'percentOver' = 'percentOver';
  percentOver: number;

  constructor(init?: Partial<VicPercentOverDomainPaddingConfig>) {
    super();
    this.percentOver = 0.1;
    Object.assign(this, init);
  }
}

export class VicPixelDomainPaddingConfig extends VicBaseDomainPaddingConfig {
  type: 'numPixels' = 'numPixels';
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

export class VicCategoricalColorDimensionConfig extends VicDataDimensionConfig {
  override domain?: any[] | InternSet;
  colorScale?: (...args: any) => any;
  colors?: string[];
  constructor(init?: Partial<VicCategoricalColorDimensionConfig>) {
    super();
    Object.assign(this, init);
  }
}

export class VicOrdinalDimensionConfig extends VicDataDimensionConfig {
  override domain?: any[] | InternSet;
  scaleType: (d: any, r: any) => any;
  paddingInner: number;
  paddingOuter: number;
  align: number;

  constructor(init?: Partial<VicOrdinalDimensionConfig>) {
    super();
    this.scaleType = scaleBand;
    this.paddingInner = 0.1;
    this.paddingOuter = 0.1;
    this.align = 0.5;
    Object.assign(this, init);
  }
}
