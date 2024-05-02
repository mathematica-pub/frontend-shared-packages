import { ScaleContinuousNumeric, max, min, scaleLinear } from 'd3';
import { VicDataDimension, VicDimension } from './data-dimension';
import { VicDomainPaddingConfig } from './domain-padding/domain-padding';

export class VicQuantitativeDimension<Datum> extends VicDataDimension<
  Datum,
  number
> {
  type: VicDimension.quantitative = VicDimension.quantitative;
  domain: [number, number];
  unpaddedDomain: [number, number];
  domainIncludesZero: boolean;
  domainPadding: VicDomainPaddingConfig;
  scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;

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
