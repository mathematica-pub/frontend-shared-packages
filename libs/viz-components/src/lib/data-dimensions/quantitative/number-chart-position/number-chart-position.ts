import { ScaleContinuousNumeric } from 'd3';
import { NumberDimension } from '../number-dimension/number-dimension';
import { ConcreteDomainPadding } from './domain-padding/concrete-domain-padding';
import { NumberChartPositionDimensionOptions } from './number-chart-position-options';

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
    super();
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
