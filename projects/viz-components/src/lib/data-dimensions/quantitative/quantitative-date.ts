import { ScaleTime, max, min } from 'd3';
import { isDate } from '../../core/utilities/type-guards';
import { DataDimension } from '../dimension';
import { QuantitativeDateDimensionOptions } from './quantitative-date-options';

export class QuantitativeDateDimension<Datum>
  extends DataDimension<Datum, Date>
  implements QuantitativeDateDimensionOptions<Datum>
{
  private calculatedDomain: [Date, Date];
  readonly domain: [Date, Date];
  readonly formatSpecifier: string;
  scaleFn: (
    domain?: Iterable<Date>,
    range?: Iterable<number>
  ) => ScaleTime<number, number>;

  constructor(options: QuantitativeDateDimensionOptions<Datum>) {
    super();
    Object.assign(this, options);
  }

  setPropertiesFromData(data: Datum[]): void {
    this.setValues(data);
    this.setDomain();
  }

  protected setDomain() {
    const extents: [Date, Date] =
      this.domain === undefined
        ? [min(this.values), max(this.values)]
        : this.domain;
    this.calculatedDomain = extents;
  }

  getScaleFromRange(range: [number, number]) {
    return this.scaleFn().domain(this.calculatedDomain).range(range);
  }

  // returns false if data is undefined or null of not a Date
  // for some charts this may be fine
  // original intended use case: d3Line can only handle defined values
  isValidValue(x: unknown): boolean {
    return isDate(x);
  }
}
