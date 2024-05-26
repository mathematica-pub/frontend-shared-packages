import { ScaleContinuousNumeric, max, min, scaleLinear } from 'd3';
import { VicDataDimension, VicDataDimensionOptions } from './data-dimension';
import { VicDomainPaddingConfig } from './domain-padding/domain-padding';

const DEFAULT = {
  domainIncludesZero: true,
  scaleFn: scaleLinear,
};

export interface VicQuantitativeDimensionOptions<Datum>
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
  domainPadding: VicDomainPaddingConfig;
  /**
   * The scale function for the dimension. This is a D3 scale function that maps values from the dimension's domain to the dimension's range.
   */
  scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;
}

export class VicQuantitativeDimension<Datum>
  extends VicDataDimension<Datum, number>
  implements VicQuantitativeDimensionOptions<Datum>
{
  private calculatedDomain: [number, number];
  readonly domain: [number, number];
  domainIncludesZero: boolean;
  readonly domainPadding: VicDomainPaddingConfig;
  readonly includeZeroInDomain: boolean;
  readonly scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;
  readonly valueAccessor: (d: Datum, ...args: any) => number;

  constructor(options: Partial<VicQuantitativeDimensionOptions<Datum>>) {
    super();
    Object.assign(this, options);
    this.includeZeroInDomain =
      this.includeZeroInDomain ?? DEFAULT.domainIncludesZero;
    this.scaleFn = this.scaleFn ?? DEFAULT.scaleFn;
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
}

/**
 * @param {Partial<VicQuantitativeDimensionOptions<Datum>>} options - **REQUIRED**
 * @param {(d: Datum, ...args: any) => number} options.valueAccessor - (d: Datum, ...args: any) => number - **REQUIRED**
 * @param {[number, number]} options.domain - [number, number] - A user-provided range of values that is used as the domain of the dimension's scale. If not provided by the user, unique values from the data are used to set the scale domain.
 * @param {boolean} options.includeZeroInDomain - boolean - A user-configurable boolean that indicates whether the domain of the dimension's scale should include zero if it is not already included in the domain. Default is true.
 * @param {VicDomainPaddingConfig} options.domainPadding - VicDomainPaddingConfig - padding configuration for the dimension's domain. Default is undefined.
 * @param {(domain?: Iterable<number>, range?: Iterable<number>) => ScaleContinuousNumeric<number, number>} options.scaleFn - (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number> - scale function for the dimension. This is a D3 scale function that maps values from the dimension's domain to the dimension's range. Default is D3's scaleLinear function.
 * @param {VicFormatSpecifier<Datum>} valueFormat - VicFormatSpecifier<Datum> - A user-defined format specifier for the dimension's values. Default is undefined.
  * @returns
 */
export function vicQuantitativeDimension<Datum>(
  options: Partial<VicQuantitativeDimensionOptions<Datum>>
): VicQuantitativeDimension<Datum> {
  return new VicQuantitativeDimension(options);
}
