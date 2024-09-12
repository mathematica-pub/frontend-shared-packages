import { PrimaryMarksConfig } from '../../marks/primary-marks/config/primary-marks-config';
import { VicXyPrimaryMarks } from '../../marks/xy-marks/xy-primary-marks/xy-primary-marks';

export class XyDataMarksStub<Datum> extends VicXyPrimaryMarks<
  Datum,
  PrimaryMarksConfig<Datum>
> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override setChartScalesFromRanges(useTransition: boolean): void {
    return;
  }
  override drawMarks(): void {
    return;
  }
}
