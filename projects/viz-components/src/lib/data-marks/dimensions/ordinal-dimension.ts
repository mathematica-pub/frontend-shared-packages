import { InternSet, ScaleBand, scaleBand } from 'd3';
import { VicDataValue } from '../../core/types/values';
import { VicDataDimension, VicDataDimensionOptions } from './data-dimension';

const DEFAULT = {
  align: 0.5,
  paddingInner: 0.1,
  paddingOuter: 0.1,
  valueAccessor: (d, i) => i,
};

export interface VicOrdinalDimensionOptions<
  Datum,
  TOrdinalValue extends VicDataValue
> extends VicDataDimensionOptions<Datum, TOrdinalValue> {
  domain: TOrdinalValue[];
  paddingInner: number;
  paddingOuter: number;
  align: number;
}

export class VicOrdinalDimension<Datum, TOrdinalValue extends VicDataValue>
  extends VicDataDimension<Datum, TOrdinalValue>
  implements VicOrdinalDimensionOptions<Datum, TOrdinalValue>
{
  readonly align: number;
  domain: TOrdinalValue[];
  private internSetDomain: InternSet<TOrdinalValue>;
  readonly paddingInner: number;
  readonly paddingOuter: number;
  private scaleFn: (
    domain?: Iterable<TOrdinalValue>,
    range?: Iterable<number>
  ) => ScaleBand<TOrdinalValue>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override readonly valueAccessor: (d: Datum, ...args: any) => TOrdinalValue;

  constructor(
    options?: Partial<VicOrdinalDimensionOptions<Datum, TOrdinalValue>>
  ) {
    super();
    this.scaleFn = scaleBand;
    Object.assign(this, options);
    this.align = this.align ?? DEFAULT.align;
    this.paddingInner = this.paddingInner ?? DEFAULT.paddingInner;
    this.paddingOuter = this.paddingOuter ?? DEFAULT.paddingOuter;
    this.valueAccessor = this.valueAccessor ?? DEFAULT.valueAccessor;
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

export function vicOrdinalDimension<Datum, TOrdinalValue extends VicDataValue>(
  options?: Partial<VicOrdinalDimensionOptions<Datum, TOrdinalValue>>
): VicOrdinalDimension<Datum, TOrdinalValue> {
  return new VicOrdinalDimension(options);
}
