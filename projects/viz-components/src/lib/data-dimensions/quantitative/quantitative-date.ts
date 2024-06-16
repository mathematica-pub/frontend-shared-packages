import { ScaleTime, max, min, scaleUtc } from 'd3';
import { isDate } from '../../core/utilities/type-guards';
import { VicDataDimension, VicDataDimensionOptions } from '../dimension';

const DEFAULT = {
  scaleFn: scaleUtc,
};

export interface VicDimensionQuantitativeDateOptions<Datum>
  extends VicDataDimensionOptions<Datum, Date> {
  domain: [Date, Date];
  scaleFn: (
    domain?: Iterable<Date>,
    range?: Iterable<number>
  ) => ScaleTime<number, number>;
}

export class VicDimensionQuantitativeDate<Datum>
  extends VicDataDimension<Datum, Date>
  implements VicDimensionQuantitativeDateOptions<Datum>
{
  private calculatedDomain: [Date, Date];
  readonly domain: [Date, Date];
  scaleFn: (
    domain?: Iterable<Date>,
    range?: Iterable<number>
  ) => ScaleTime<number, number>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly valueAccessor: (d: Datum, ...args: any) => Date;

  constructor(options: Partial<VicDimensionQuantitativeDate<Datum>>) {
    super();
    Object.assign(this, options);
    this.scaleFn = this.scaleFn ?? DEFAULT.scaleFn<number, number>;
    if (this.valueAccessor === undefined) {
      throw new Error('A value accessor function is required.');
    }
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
