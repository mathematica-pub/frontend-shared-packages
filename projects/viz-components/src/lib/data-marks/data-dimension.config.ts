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
    this.domainPadding = new DomainPaddingConfig();
    Object.assign(this, init);
  }
}

export class DomainPaddingConfig {
  type: 'round' | 'percent' | 'none';
  sigDigits: number;
  percent: number;

  constructor(init?: Partial<DomainPaddingConfig>) {
    this.type = 'round';
    this.sigDigits = 2;
    this.percent = 0.1;
    Object.assign(this, init);
  }
}
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
