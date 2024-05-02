import { VicDataMarksConfig } from '../../data-marks/data-marks-types';
import { MapDataMarksBase } from '../../map-data-marks/map-data-marks-base';

export class MapDataMarksBaseStub<Datum> extends MapDataMarksBase<
  Datum,
  VicDataMarksConfig<Datum>
> {
  override setPropertiesFromData(): void {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override setPropertiesFromRanges(useTransition: boolean): void {
    return;
  }
  drawMarks(): void {
    return;
  }
  resizeMarks(): void {
    return;
  }
}
