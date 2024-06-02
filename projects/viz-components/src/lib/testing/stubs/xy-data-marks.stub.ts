import { VicDataConfig } from '../../data-marks/data-marks.config';
import { VicXyDataMarks } from '../../xy-data-marks/xy-data-marks';

export class XyDataMarksStub<Datum> extends VicXyDataMarks<
  Datum,
  VicDataConfig<Datum>
> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override setPropertiesFromRanges(useTransition: boolean): void {
    return;
  }
  override drawMarks(): void {
    return;
  }
}
