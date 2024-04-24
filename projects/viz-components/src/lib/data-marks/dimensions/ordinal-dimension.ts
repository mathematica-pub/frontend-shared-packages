import { InternSet, ScaleBand, scaleBand } from 'd3';
import { VicDataDimension, VicDataValue, VicDimension } from './data-dimension';

export class VicOrdinalDimension<
  Datum,
  TOrdinalValue extends VicDataValue
> extends VicDataDimension<Datum, TOrdinalValue> {
  domain: TOrdinalValue[];
  private internSetDomain: InternSet<TOrdinalValue>;
  type: VicDimension.ordinal = VicDimension.ordinal;
  scaleFn: (
    domain?: Iterable<TOrdinalValue>,
    range?: Iterable<number>
  ) => ScaleBand<TOrdinalValue>;
  paddingInner: number;
  paddingOuter: number;
  align: number;

  constructor(init?: Partial<VicOrdinalDimension<Datum, TOrdinalValue>>) {
    super();
    this.scaleFn = scaleBand;
    this.paddingInner = 0.1;
    this.paddingOuter = 0.1;
    this.align = 0.5;
    Object.assign(this, init);
  }

  setPropertiesFromData(data: Datum[], reverseDomain: boolean): void {
    this.setValues(data);
    this.initDomain(reverseDomain);
  }

  domainIncludes(value: TOrdinalValue): boolean {
    return this.internSetDomain.has(value);
  }

  private initDomain(reverseDomain: boolean): void {
    if (this.domain === undefined) {
      this.domain = this.values;
    }
    const domain = reverseDomain ? this.domain.slice().reverse() : this.domain;
    this.internSetDomain = new InternSet(domain);
    this.domain = [...this.internSetDomain.values()];
  }

  getScaleFromRange(range: [number, number]) {
    return this.scaleFn()
      .domain(this.domain)
      .range(range)
      .paddingInner(this.paddingInner)
      .paddingOuter(this.paddingOuter)
      .align(this.align);
  }
}
