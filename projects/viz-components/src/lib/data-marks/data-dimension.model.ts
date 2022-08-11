import { InternSet, scaleBand } from 'd3';

export class DataDimension {
  valueAccessor: (...args: any) => any;
  domain?: any;
  valueFormat?: string;
  constructor(init?: Partial<DataDimension>) {
    Object.assign(this, init);
  }
}

export class QuantitativeDimension extends DataDimension {
  override domain?: [any, any];
  scaleType?: (d: any, r: any) => any;
  domainPadding: DomainPadding;

  constructor(init?: Partial<QuantitativeDimension>) {
    super();
    this.domainPadding = new DomainPadding();
    Object.assign(this, init);
  }
}

export class DomainPadding {
  type: 'round' | 'percent' | 'none';
  sigDigits: number;
  percent: number;

  constructor(init?: Partial<DomainPadding>) {
    this.type = 'round';
    this.sigDigits = 2;
    this.percent = 0.1;
    Object.assign(this, init);
  }
}
export class CategoricalColorDimension extends DataDimension {
  override domain?: any[] | InternSet;
  colorScale?: (...args: any) => any;
  colors?: string[];
  constructor(init?: Partial<CategoricalColorDimension>) {
    super();
    Object.assign(this, init);
  }
}

export class OrdinalDimension extends DataDimension {
  override domain?: any[] | InternSet;
  scaleType: (d: any, r: any) => any;
  paddingInner: number;
  paddingOuter: number;
  align: number;

  constructor(init?: Partial<OrdinalDimension>) {
    super();
    this.scaleType = scaleBand;
    this.paddingInner = 0.1;
    this.paddingOuter = 0.1;
    this.align = 0.5;
    Object.assign(this, init);
  }
}
