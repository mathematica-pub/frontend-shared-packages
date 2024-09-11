/* eslint-disable @typescript-eslint/no-unused-vars */

import { MapPrimaryMarks } from '../../map-marks/map-primary-marks/map-primary-marks';
import { MarksOptions } from '../../marks/config/marks-options';

export class MapDataMarksBaseStub<Datum> extends MapPrimaryMarks<
  Datum,
  MarksOptions<Datum>
> {
  override setChartScalesFromRanges(useTransition: boolean): void {
    return;
  }
  drawMarks(): void {
    return;
  }
}
