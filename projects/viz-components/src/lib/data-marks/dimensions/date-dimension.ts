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
  domain: [Date, Date];
  scaleFn: (
    domain?: Iterable<Date>,
    range?: Iterable<number>
  ) => ScaleTime<number, number>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly valueAccessor: (d: Datum, ...args: any) => Date;
  private unpaddedDomain: [Date, Date];

  constructor(options: Partial<VicDateDimension<Datum>>) {
    super();
    Object.assign(this, options);
    this.scaleFn = this.scaleFn ?? DEFAULT.scaleFn<number, number>;
  }

  setPropertiesFromData(data: Datum[]): void {
    this.setValues(data);
    this.setUnpaddedDomain();
  }

  setUnpaddedDomain() {
    const extents =
      this.domain === undefined
        ? ([min(this.values), max(this.values)] as [Date, Date])
        : this.domain;
    this.unpaddedDomain = extents;
  }

  getScaleFromRange(range: [number, number]) {
    return this.scaleFn().domain(this.unpaddedDomain).range(range);
  }
}

export function vicDateDimension<Datum>(
  options: Partial<VicDateDimensionOptions<Datum>>
): VicDateDimension<Datum> {
  return new VicDateDimension(options);
}
