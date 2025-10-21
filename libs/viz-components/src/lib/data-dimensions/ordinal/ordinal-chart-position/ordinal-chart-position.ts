import { safeAssign } from '@mathstack/app-kit';
import { InternSet, ScaleBand, scaleBand, scalePoint, ScalePoint } from 'd3';
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
 *   - tested in: bars.cy.ts, dots.cy.ts, stacked-bars.cy.ts
 * - It sets the domain of the dimension.
 *   - tested in: bars.cy.ts, dots.cy.ts
 * - It checks if a value is in the domain.
 *   - tested in: bars.cy.ts
 * - It creates a scale from a range.
 *   - tested in: bars.cy.ts, dots.cy.ts
 * - The domain will be unique values from the user-provided domain if the user provides a domain.
 *   - tested in: ordinal-chart-position.spec.ts
 * - The domain will be unique values from the data if no custom domain is given by the user.
 *   - tested in: ordinal-chart-position.spec.ts
 * - The domain can be set in reverse order.
 *   - tested in: ordinal-chart-position.spec.ts
 */

export class OrdinalChartPositionDimension<Datum, Domain extends DataValue>
  extends DataDimension<Datum, Domain>
  implements OrdinalChartPositionDimensionOptions<Datum, Domain> {
  readonly align: number;
  private _calculatedDomain: Domain[];
  readonly domain: Domain[];
  private internSetDomain: InternSet<Domain>;
  readonly paddingInner: number;
  readonly paddingOuter: number;
  private scaleFn: (
    domain?: Iterable<Domain>,
    range?: Iterable<number>
  ) => ScaleBand<Domain> | ScalePoint<Domain>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override readonly valueAccessor: (d: Datum, ...args: any) => Domain;

  constructor(
    scaleType: 'band' | 'point' = 'band',
    options: OrdinalChartPositionDimensionOptions<Datum, Domain>
  ) {
    super('ordinal');
    this.scaleFn = scaleType === 'band' ? scaleBand : scalePoint;
    safeAssign(this, options);
  }

  get calculatedDomain(): Domain[] {
    return this._calculatedDomain;
  }

  setPropertiesFromData(data: Datum[], reverseDomain: boolean = false): void {
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

  domainIncludes(value: Domain): boolean {
    return this.internSetDomain.has(value);
  }

  getScaleFromRange(
    range: [number, number]
  ): ScaleBand<Domain> | ScalePoint<Domain> {
    if (this.scaleFn === scalePoint) {
      return (this.scaleFn() as ScalePoint<Domain>)
        .domain(this._calculatedDomain)
        .range(range)
        .padding(this.paddingOuter)
        .align(this.align);
    } else {
      return (this.scaleFn() as ScaleBand<Domain>)
        .domain(this._calculatedDomain)
        .range(range)
        .paddingInner(this.paddingInner)
        .paddingOuter(this.paddingOuter)
        .align(this.align);
    }
  }
}
