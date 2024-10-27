import { ScaleContinuousNumeric, max, min } from 'd3';
import { isNumber } from '../../core/utilities/type-guards';
import { DataDimension } from '../dimension';
import { ConcreteDomainPadding } from './number-chart-position/domain-padding/concrete-domain-padding';
import { QuantitativeNumericDimensionOptions } from './quantitative-numeric-options';

export class QuantitativeNumericDimension<Datum>
  extends DataDimension<Datum, number>
  implements QuantitativeNumericDimensionOptions<Datum>
{
  private calculatedDomain: [number, number];
  readonly domain: [number, number];
  domainIncludesZero: boolean;
  readonly domainPadding?: ConcreteDomainPadding;
  readonly formatSpecifier: string;
  readonly includeZeroInDomain: boolean;
  readonly scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;

  constructor(options: QuantitativeNumericDimensionOptions<Datum>) {
    super();
    Object.assign(this, options);
  }

  setPropertiesFromData(data: Datum[]): void {
    this.setValues(data);
    this.setDomain();
  }

  setDomain(valuesOverride?: [number, number]) {
    const extents: [number, number] =
      this.domain === undefined
        ? valuesOverride || [min(this.values), max(this.values)]
        : this.domain;
    this.calculatedDomain = this.getCalculatedDomain(extents);
    this.setDomainIncludesZero();
  }

  private getCalculatedDomain(domain: [number, number]): [number, number] {
    return this.includeZeroInDomain
      ? [min([domain[0], 0]), max([domain[1], 0])]
      : domain;
  }

  private setDomainIncludesZero() {
    this.domainIncludesZero =
      this.calculatedDomain[0] <= 0 && 0 <= this.calculatedDomain[1];
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

  // returns false if data is undefined or null or not a number
  // for some charts this may be fine
  // original intended use case: d3Line can only handle defined values
  isValidValue(x: unknown): boolean {
    return isNumber(x);
  }
}
