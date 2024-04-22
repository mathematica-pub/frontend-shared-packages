import { ScaleTime, max, min, scaleUtc } from 'd3';
import { VicDataDimensionConfig, VicDimension } from './data-dimension';
import { VicQuantitativeDimensionConfig } from './quantitative-dimension';

export class VicDateDimensionConfig<Datum> extends VicDataDimensionConfig<
  Datum,
  Date
> {
  type: VicDimension.date = VicDimension.date;
  override domain?: [Date, Date];
  unpaddedDomain: [Date, Date];
  scaleFn: (
    domain?: Iterable<Date>,
    range?: Iterable<number>
  ) => ScaleTime<number, number>;

  constructor(init?: Partial<VicQuantitativeDimensionConfig<Datum>>) {
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
