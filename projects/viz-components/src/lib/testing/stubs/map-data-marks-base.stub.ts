/* eslint-disable @typescript-eslint/no-unused-vars */
import { MapPrimaryMarks } from '../../map-data-marks/map-data-marks';
import { PrimaryMarksOptions } from '../../marks/primary-marks/config/primary-marks-options';

export class MapDataMarksBaseStub<Datum> extends MapPrimaryMarks<
  Datum,
  PrimaryMarksOptions<Datum>
> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override setChartScalesFromRanges(useTransition: boolean): void {
    return;
  }
  drawMarks(): void {
    return;
  }
}
