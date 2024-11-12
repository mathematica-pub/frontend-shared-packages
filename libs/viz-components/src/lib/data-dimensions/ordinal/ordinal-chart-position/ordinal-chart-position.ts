import { InternSet, ScaleBand, scaleBand } from 'd3';
import { DataValue } from '../../../core/types/values';
import { DataDimension } from '../../dimension';
import { OrdinalChartPositionDimensionOptions } from './ordinal-chart-position-options';

export class OrdinalChartPositionDimension<
    Datum,
    TOrdinalValue extends DataValue,
  >
  extends DataDimension<Datum, TOrdinalValue>
  implements OrdinalChartPositionDimensionOptions<Datum, TOrdinalValue>
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
    options: OrdinalChartPositionDimensionOptions<Datum, TOrdinalValue>
  ) {
    super();
    this.scaleFn = scaleBand;
    Object.assign(this, options);
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
