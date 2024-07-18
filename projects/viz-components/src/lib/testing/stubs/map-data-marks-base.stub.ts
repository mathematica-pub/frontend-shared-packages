/* eslint-disable @typescript-eslint/no-unused-vars */
import { VicDataMarksOptions } from '../../data-marks/config/data-marks-options';
import { VicMapDataMarks } from '../../map-data-marks/map-data-marks';

export class MapDataMarksBaseStub<Datum> extends VicMapDataMarks<
  Datum,
  VicDataMarksOptions<Datum>
> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override setPropertiesFromRanges(useTransition: boolean): void {
    return;
  }
  drawMarks(): void {
    return;
  }
}
