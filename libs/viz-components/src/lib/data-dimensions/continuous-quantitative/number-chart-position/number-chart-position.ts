import { ScaleContinuousNumeric } from 'd3';
import { NumberDimension } from '../number-dimension/number-dimension';
import { ConcreteDomainPadding } from './domain-padding/concrete-domain-padding';
import { NumberChartPositionDimensionOptions } from './number-chart-position-options';

/**
 * A dimension that transforms number values into a position on a chart.
 *
 * This dimension is used for the positional dimensions of a chart, such as x and y. The resultant scale will confirm to the ScaleContinuousNumeric interface from @types/d3. The range of the scale will be a dimension from the chart.
 *
 * The generic is the type of the data that will be passed to the dimension.
 *
 * TESTABLE FUNCTIONALITY
 *
 * - It extracts values for the dimension from data.
 *   - tested in: bars.cy.ts, dots.cy.ts, lines.cy.ts, stacked-bars.cy.ts
 * - It sets the domain of the dimension.
 *   - tested in: bars.cy.ts, dots.cy.ts, lines.cy.ts, stacked-bars.cy.ts
 * - It creates and returns a scale from a range and the a padded domain if domain padding is provided.
 *   - tested in: quantitative-domain-padding.cy.ts
 * - It creates and returns a scale from a range and the regular domain if domain padding is not provided.
 *   - tested in: bars.cy.ts, dots.cy.ts, lines.cy.ts, stacked-bars.cy.ts
 */

export class NumberChartPositionDimension<Datum>
  extends NumberDimension<Datum>
  implements NumberChartPositionDimensionOptions<Datum>
{
  readonly domainPadding?: ConcreteDomainPadding;
  readonly scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;

  constructor(options: NumberChartPositionDimensionOptions<Datum>) {
    super('number');
    Object.assign(this, options);
  }

  setPropertiesFromData(data: Datum[]): void {
    this.setValues(data);
    this.setDomain();
  }

  getScaleFromRange(range: [number, number]) {
    const domain = this.domainPadding
      ? this.getPaddedQuantitativeDomain(range)
      : this.calculatedDomain;
    return this.scaleFn().domain(domain).range(range);
  }

  private getPaddedQuantitativeDomain(
    range: [number, number]
  ): [number, number] {
    return this.domainPadding.getPaddedDomain(
      this.calculatedDomain,
      this.scaleFn,
      range
    );
  }
}
