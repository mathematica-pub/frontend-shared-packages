import { ScaleTime, max, min, scaleUtc } from 'd3';
import { VicDataDimension, VicDataDimensionOptions } from './data-dimension';

const DEFAULT = {
  scaleFn: scaleUtc,
};

export interface VicDateDimensionOptions<Datum>
  extends VicDataDimensionOptions<Datum, Date> {
  domain: [Date, Date];
  scaleFn: (
    domain?: Iterable<Date>,
    range?: Iterable<number>
  ) => ScaleTime<number, number>;
}

export class VicDateDimension<Datum>
  extends VicDataDimension<Datum, Date>
  implements VicDateDimensionOptions<Datum>
{
  private calculatedDomain: [Date, Date];
  readonly domain: [Date, Date];
  scaleFn: (
    domain?: Iterable<Date>,
    range?: Iterable<number>
  ) => ScaleTime<number, number>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly valueAccessor: (d: Datum, ...args: any) => Date;

  constructor(options: Partial<VicDateDimension<Datum>>) {
    super();
    Object.assign(this, options);
    this.scaleFn = this.scaleFn ?? DEFAULT.scaleFn<number, number>;
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
}

/**
 * @param {Partial<VicQuantitativeDimensionOptions<Datum>>} options - **REQUIRED**
 * @param {(d: Datum, ...args: any) => number} options.valueAccessor - (d: Datum, ...args: any) => Date - **REQUIRED**
 * @param {[number, number]} options.domain - [Date, Date] - A user-provided range of values that is used as the domain of the dimension's scale. If not provided by the user, unique values from the data are used to set the scale domain.
 * @param {(domain?: Iterable<number>, range?: Iterable<number>) => ScaleTime<number, number>} options.scaleFn - (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleTime<number, number> - scale function for the dimension. This is a D3 scale function that maps values from the dimension's domain to the dimension's range. Default is D3's scaleUtc function.
 * @param {VicFormatSpecifier<Datum>} valueFormat - VicFormatSpecifier<Datum> - A user-defined format specifier for the dimension's values. Default is undefined.
  * @returns
 */
export function vicDateDimension<Datum>(
  options: Partial<VicDateDimensionOptions<Datum>>
): VicDateDimension<Datum> {
  return new VicDateDimension(options);
}
