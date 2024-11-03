import { InternSet, ScaleBand, scaleBand } from 'd3';
import { DataValue } from '../../../core/types/values';
import { DataDimension } from '../../dimension';
import { OrdinalChartPositionDimensionOptions } from './ordinal-chart-position-options';

/**
 * A dimension that transforms string / number / Date values into a position on a chart.
 *
 * This dimension is used for the positional dimensions of a chart, such as x and y. The underlying scale will always be a [D3 band scale](https://d3js.org/d3-scale/band). The range of the scale will be a dimension from the chart.
 *
 * The first generic is the type of the data that will be passed to the dimension. The second generic is the type of the value that will be used to position the data on the chart.
 *
 * TESTABLE FUNCTIONALITY
 *
 * - It extracts values for the dimension from data.
 *   - tested in:
 * - It sets the domain of the dimension.
 *   - tested in:
 * - It checks if a value is in the domain.
 *   - tested in:
 * - It creates a scale from a range.
 *   - tested in:
 * - The domain will be unique values from the user-provided domain if the user provides a domain.
 *   - tested in: ordinal-chart-position.spec.ts
 * - The domain will be unique values from the data if no custom domain is given by the user.
 *   - tested in: ordinal-chart-position.spec.ts
 * - The domain can be set in reverse order.
 *   - tested in: ordinal-chart-position.spec.ts
 */

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
