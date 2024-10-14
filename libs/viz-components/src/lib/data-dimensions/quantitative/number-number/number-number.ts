import { max, min, ScaleContinuousNumeric } from 'd3';
import { isNumber } from '../../../core/utilities/type-guards';
import { DataDimension } from '../../dimension';
import { NumberNumberDimensionOptions } from '../number-number-options';

export class NumberNumberDimension<Datum>
  extends DataDimension<Datum, number>
  implements NumberNumberDimensionOptions<Datum>
{
  protected calculatedDomain: [number, number];
  readonly domain: [number, number];
  domainIncludesZero: boolean;
  readonly formatSpecifier: string;
  readonly includeZeroInDomain: boolean;
  readonly scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;

  constructor(options: NumberNumberDimensionOptions<Datum>) {
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

  protected getCalculatedDomain(domain: [number, number]): [number, number] {
    return this.includeZeroInDomain
      ? [min([domain[0], 0]), max([domain[1], 0])]
      : domain;
  }

  protected setDomainIncludesZero() {
    this.domainIncludesZero =
      this.calculatedDomain[0] <= 0 && 0 <= this.calculatedDomain[1];
  }

  getScaleFromRange(range: [number, number]) {
    return this.scaleFn().domain(this.calculatedDomain).range(range);
  }

  // returns false if data is undefined or null or not a number
  // for some charts this may be fine
  // original intended use case: d3Line can only handle defined values
  isValidValue(x: unknown): boolean {
    return isNumber(x);
  }
}
