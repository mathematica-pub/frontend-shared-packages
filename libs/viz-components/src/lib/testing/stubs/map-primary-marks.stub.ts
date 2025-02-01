/* eslint-disable @typescript-eslint/no-unused-vars */

import { MarksOptions } from '../../marks/config/marks-options';
import { MapPrimaryMarks } from '../../marks/map-marks/map-primary-marks/map-primary-marks';

export class MapPrimaryMarksStub<Datum> extends MapPrimaryMarks<
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
