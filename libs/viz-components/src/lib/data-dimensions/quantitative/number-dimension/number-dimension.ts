import { max, min } from 'd3';
import { isNumber } from '../../../core/utilities/type-guards';
import { DataDimension } from '../../dimension';

export abstract class NumberDimension<Datum> extends DataDimension<
  Datum,
  number
> {
  protected calculatedDomain: [number, number];
  readonly domain: [number, number];
  domainIncludesZero: boolean;
  readonly formatSpecifier: string;
  readonly includeZeroInDomain: boolean;

  setDomain(valuesOverride?: [number, number]) {
    const extents: [number, number] =
      this.domain === undefined
        ? valuesOverride || [min(this.values), max(this.values)]
        : this.domain;
    this.calculatedDomain = this.getCalculatedDomain(extents);
    this.setDomainIncludesZero();
  }

  protected getCalculatedDomain(domain: [number, number]): [number, number] {
    return this.includeZeroInDomain
      ? [min([domain[0], 0]), max([domain[1], 0])]
      : domain;
  }

  protected setDomainIncludesZero() {
    this.domainIncludesZero =
      this.calculatedDomain[0] <= 0 && 0 <= this.calculatedDomain[1];
  }

  // returns false if data is undefined or null or not a number
  // for some charts this may be fine
  // original intended use case: d3Line can only handle defined values
  isValidValue(x: unknown): boolean {
    return isNumber(x);
  }
}
