import { ScaleContinuousNumeric, max, min, scaleLinear } from 'd3';
import { VicDataDimension, VicDimension } from './data-dimension';
import { VicDomainPaddingConfig } from './domain-padding/domain-padding';

export class VicQuantitativeDimension<Datum> extends VicDataDimension<
  Datum,
  number
> {
  /**
   * The type of the dimension. This is always 'quantitative'.
   */
  type: VicDimension.quantitative = VicDimension.quantitative;
  /**
   * The domain of the dimension's scale, adjusted to include zero if the domain does not include zero and the user has specified that it should.
   */
  private unpaddedDomain: [number, number];
  /**
   * The scale function for the dimension. This is a D3 scale function that maps values from the dimension's domain to the dimension's range.
   */
  private scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;
  /**
   * An optional, user-provided range of values that is used as the domain of the dimension's scale.
   *
   * If not provided by the user, it remains undefined.
   */
  domain: [number, number];
  /**
   * A user-configurable boolean that indicates whether the domain of the dimension's scale should include zero.
   */
  domainIncludesZero: boolean;
  /**
   * The padding configuration for the dimension's domain.
   */
  domainPadding: VicDomainPaddingConfig;

  constructor(init?: Partial<VicQuantitativeDimension<Datum>>) {
    super();
    this.scaleFn = scaleLinear;
    this.domainIncludesZero = true;
    Object.assign(this, init);
  }

  setPropertiesFromData(data: Datum[]): void {
    this.setValues(data);
    this.setUnpaddedDomain();
  }

  setUnpaddedDomain(valuesOverride?: [number, number]) {
    const extents =
      this.domain === undefined
        ? valuesOverride ||
          ([min(this.values), max(this.values)] as [number, number])
        : this.domain;
    this.unpaddedDomain = this.getAdjustedDomain(
      extents,
      this.domainIncludesZero
    );
    this.setDomainIncludesZero();
  }

  private getAdjustedDomain(
    domain: [number, number],
    domainIncludesZero: boolean
  ): [number, number] {
    return domainIncludesZero
      ? [min([domain[0], 0]), max([domain[1], 0])]
      : [domain[0], domain[1]];
  }

  private setDomainIncludesZero() {
    if (
      !this.domainIncludesZero &&
      this.unpaddedDomain[0] <= 0 &&
      this.unpaddedDomain[1] >= 0
    ) {
      this.domainIncludesZero = true;
    }
  }

  getScaleFromRange(range: [number, number]) {
    const domain = this.domainPadding
      ? this.getPaddedQuantitativeDomain(range)
      : this.unpaddedDomain;
    return this.scaleFn().domain(domain).range(range);
  }

  private getPaddedQuantitativeDomain(
    range: [number, number]
  ): [number, number] {
    const domain = this.domainPadding.getPaddedDomain(
      this.unpaddedDomain,
      this.scaleFn,
      range
    );
    return domain;
  }
}
