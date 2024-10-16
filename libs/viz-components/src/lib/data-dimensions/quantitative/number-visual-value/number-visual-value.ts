import { max, min, ScaleContinuousNumeric } from 'd3';
import { VisualValue } from '../../../core';
import { isNumber } from '../../../core/utilities/type-guards';
import { DataDimension } from '../../dimension';
import { NumberVisualValueDimensionOptions } from './number-visual-value-options';

export class NumberVisualValueDimension<Datum, Range extends VisualValue>
  extends DataDimension<Datum, number>
  implements NumberVisualValueDimensionOptions<Datum, Range>
{
  protected calculatedDomain: [number, number];
  readonly domain: [number, number];
  domainIncludesZero: boolean;
  readonly formatSpecifier: string;
  readonly includeZeroInDomain: boolean;
  readonly range: Range[];
  readonly scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<Range>
  ) => ScaleContinuousNumeric<Range, Range>;
  scale: (value: number) => Range;

  constructor(options: NumberVisualValueDimensionOptions<Datum, Range>) {
    super();
    Object.assign(this, options);
  }

  setPropertiesFromData(data: Datum[]): void {
    this.setValues(data);
    this.setDomain();
    this.setScale();
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

  private setScale(): void {
    if (this.scale === undefined) {
      this.scale = this.scaleFn()
        .domain(this.calculatedDomain)
        .range(this.range);
    }
  }

  // returns false if data is undefined or null or not a number
  // for some charts this may be fine
  // original intended use case: d3Line can only handle defined values
  isValidValue(x: unknown): boolean {
    return isNumber(x);
  }
}
