/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataMarksOptions } from '../../data-marks/config/data-marks-options';
import { MapDataMarks } from '../../map-data-marks/map-data-marks';

export class MapDataMarksBaseStub<Datum> extends MapDataMarks<
  Datum,
  DataMarksOptions<Datum>
> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override setPropertiesFromRanges(useTransition: boolean): void {
    return;
  }
  drawMarks(): void {
    return;
  }
}
