import { NumberNumberDimension } from '../number-number/number-number';
import { ConcreteDomainPadding } from './domain-padding/concrete-domain-padding';
import { NumberChartPositionDimensionOptions } from './number-chart-position-options';

export class NumberChartPositionDimension<Datum>
  extends NumberNumberDimension<Datum>
  implements NumberChartPositionDimensionOptions<Datum>
{
  readonly domainPadding?: ConcreteDomainPadding;

  constructor(options: NumberChartPositionDimensionOptions<Datum>) {
    super(options);
    Object.assign(this, options);
  }

  override getScaleFromRange(range: [number, number]) {
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
