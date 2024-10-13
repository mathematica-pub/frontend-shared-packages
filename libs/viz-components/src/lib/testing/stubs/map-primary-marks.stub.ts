/* eslint-disable @typescript-eslint/no-unused-vars */

import { MarksOptions } from '../../marks/config/marks-options';
import { VicMapPrimaryMarks } from '../../marks/map-marks/map-primary-marks/map-primary-marks';

export class MapPrimaryMarksStub<Datum> extends VicMapPrimaryMarks<
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
