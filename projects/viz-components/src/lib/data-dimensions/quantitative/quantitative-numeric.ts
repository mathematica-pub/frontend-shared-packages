import { ScaleContinuousNumeric, max, min, scaleLinear } from 'd3';
import { isNumber } from '../../core/utilities/type-guards';
import { VicDataDimension, VicDataDimensionOptions } from '../dimension';
import { VicDomainPaddingConfig } from './domain-padding/domain-padding';

const DEFAULT: Partial<VicDimensionQuantitativeNumericOptions<unknown>> = {
  includeZeroInDomain: true,
  scaleFn: scaleLinear,
};

export interface VicDimensionQuantitativeNumericOptions<Datum>
  extends VicDataDimensionOptions<Datum, number> {
  /**
   * An optional, user-provided range of values that is used as the domain of the dimension's scale.
   *
   * If not provided by the user, it remains undefined.
   */
  domain: [number, number];
  /**
   * A user-configurable boolean that indicates whether the domain of the dimension's scale should include zero.
   */
  includeZeroInDomain: boolean;
  /**
   * The padding configuration for the dimension's domain.
   */
  domainPadding?: VicDomainPaddingConfig;
  /**
   * The scale function for the dimension. This is a D3 scale function that maps values from the dimension's domain to the dimension's range.
   */
  scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;
}

export class VicDimensionQuantitativeNumeric<Datum>
  extends VicDataDimension<Datum, number>
  implements VicDimensionQuantitativeNumericOptions<Datum>
{
  private calculatedDomain: [number, number];
  readonly domain: [number, number];
  domainIncludesZero: boolean;
  readonly domainPadding?: VicDomainPaddingConfig;
  readonly includeZeroInDomain: boolean;
  readonly scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;
  readonly valueAccessor: (d: Datum) => number;

  constructor(options: Partial<VicDimensionQuantitativeNumericOptions<Datum>>) {
    super();
    Object.assign(this, options);
    this.includeZeroInDomain =
      this.includeZeroInDomain ?? DEFAULT.includeZeroInDomain;
    this.scaleFn = this.scaleFn ?? DEFAULT.scaleFn;
    if (this.valueAccessor === undefined) {
      throw new Error('A value accessor function is required.');
    }
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
