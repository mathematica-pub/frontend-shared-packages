import { InternSet, ScaleBand, scaleBand } from 'd3';
import { VicDataValue } from '../../core/types/values';
import { VicDataDimension, VicDataDimensionOptions } from '../dimension';

const DEFAULT = {
  align: 0.5,
  paddingInner: 0.1,
  paddingOuter: 0.1,
  valueAccessor: (d, i) => i,
};

export interface VicDimensionOrdinalOptions<
  Datum,
  TOrdinalValue extends VicDataValue
> extends VicDataDimensionOptions<Datum, TOrdinalValue> {
  align: number;
  domain: TOrdinalValue[];
  paddingInner: number;
  paddingOuter: number;
}

export class VicDimensionOrdinal<Datum, TOrdinalValue extends VicDataValue>
  extends VicDataDimension<Datum, TOrdinalValue>
  implements VicDimensionOrdinalOptions<Datum, TOrdinalValue>
{
  readonly align: number;
  private _calculatedDomain: TOrdinalValue[];
  readonly domain: TOrdinalValue[];
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
    options?: Partial<VicDimensionOrdinalOptions<Datum, TOrdinalValue>>
  ) {
    super();
    this.scaleFn = scaleBand;
    Object.assign(this, options);
    this.align = this.align ?? DEFAULT.align;
    this.paddingInner = this.paddingInner ?? DEFAULT.paddingInner;
    this.paddingOuter = this.paddingOuter ?? DEFAULT.paddingOuter;
    this.valueAccessor = this.valueAccessor ?? DEFAULT.valueAccessor;
  }

  get calculatedDomain(): TOrdinalValue[] {
    return this._calculatedDomain;
  }

  setPropertiesFromData(data: Datum[], reverseDomain: boolean): void {
    this.setValues(data);
    this.setDomain(reverseDomain);
  }

  protected setDomain(reverseDomain: boolean): void {
    let domain = this.domain;
    if (domain === undefined) {
      domain = this.values;
    }
    this.internSetDomain = new InternSet(domain);
    const uniqueValues = [...this.internSetDomain.values()];
    this._calculatedDomain = reverseDomain
      ? uniqueValues.reverse()
      : uniqueValues;
  }

  domainIncludes(value: TOrdinalValue): boolean {
    return this.internSetDomain.has(value);
  }

  getScaleFromRange(range: [number, number]) {
    return this.scaleFn()
      .domain(this._calculatedDomain)
      .range(range)
      .paddingInner(this.paddingInner)
      .paddingOuter(this.paddingOuter)
      .align(this.align);
  }
}
