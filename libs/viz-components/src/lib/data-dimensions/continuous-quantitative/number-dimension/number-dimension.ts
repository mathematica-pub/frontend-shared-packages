import { max, min } from 'd3';
import { isNumber } from '../../../core/utilities/type-guards';
import { DataDimension } from '../../dimension';

/**
 * An abstract dimension that for dimensions whose input values are numbers. It assumes that the domain is two numbers.
 *
 * The generic is the type of the data that will be passed to the dimension.
 *
 * TESTABLE FUNCTIONALITY
 *
 * - The domain will be the user=provided domain if the user provides a domain.
 *    - tested in: number-dimension.spec.ts
 * - The domain will be [min, max] of values if the user does not provide a domain.
 *    - tested in: number-dimension.spec.ts
 * - The domain will include 0 if includeZeroInDomain is true.
 *    - tested in: number-dimension.spec.ts
 * - domainIncludesZero will be true if 0 is in the domain.
 *   - tested in: number-dimension.spec.ts
 */
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
    console.log('valuesOverride', valuesOverride);
    const extents: [number, number] =
      this.domain === undefined
        ? valuesOverride || [min(this.values), max(this.values)]
        : this.domain;
    console.log('extents', extents);
    this.calculatedDomain = this.getCalculatedDomain(extents);
    console.log('calculatedDomain', this.calculatedDomain);
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
