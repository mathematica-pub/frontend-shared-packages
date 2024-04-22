import { InternSet, ScaleBand, scaleBand } from 'd3';
import {
  VicDataDimensionConfig,
  VicDataValue,
  VicDimension,
} from './data-dimension';

export class VicOrdinalDimensionConfig<
  Datum,
  TVicDataValue extends VicDataValue
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

  initDomain(reverseDomain: boolean): void {
    if (this.domain === undefined) {
      this.domain = this.values;
    }
    const domain = reverseDomain ? this.domain.slice().reverse() : this.domain;
    this.domain = [...new InternSet(domain)];
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
