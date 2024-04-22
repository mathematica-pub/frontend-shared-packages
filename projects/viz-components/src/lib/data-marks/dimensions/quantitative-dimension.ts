import { ScaleContinuousNumeric, max, min, scaleLinear } from 'd3';
import { VicDataDimensionConfig, VicDimension } from './data-dimension';
import { VicDomainPaddingConfig } from './domain-padding.ts/domain-padding';

export class VicQuantitativeDimensionConfig<
  Datum
> extends VicDataDimensionConfig<Datum, number> {
  type: VicDimension.quantitative = VicDimension.quantitative;
  override domain?: [number, number];
  unpaddedDomain: [number, number];
  domainIncludesZero: boolean;
  domainPadding: VicDomainPaddingConfig;
  scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;

  constructor(init?: Partial<VicQuantitativeDimensionConfig<Datum>>) {
    super();
    this.scaleFn = scaleLinear;
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
