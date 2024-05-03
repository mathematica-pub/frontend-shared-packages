import { VicDataMarksConfig } from '../../data-marks/data-marks-types';
import { VicMapDataMarks } from '../../map-data-marks/map-data-marks';

export class MapDataMarksBaseStub<Datum> extends VicMapDataMarks<
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
}
