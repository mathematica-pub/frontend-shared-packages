import { ScaleTime, max, min, scaleUtc } from 'd3';
import { VicDataDimension } from './data-dimension';

export class VicDateDimension<Datum> extends VicDataDimension<Datum, Date> {
  domain: [Date, Date];
  private unpaddedDomain: [Date, Date];
  private scaleFn: (
    domain?: Iterable<Date>,
    range?: Iterable<number>
  ) => ScaleTime<number, number>;

  constructor(init?: Partial<VicDateDimension<Datum>>) {
    super();
    this.scaleFn = scaleUtc as () => ScaleTime<number, number>;
    Object.assign(this, init);
  }

  setPropertiesFromData(data: Datum[]): void {
    this.setValues(data);
    this.setUnpaddedDomain();
  }

  private setUnpaddedDomain() {
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
