import { VicDataMarksConfig } from '../../data-marks/data-marks-types';
import { VicXyDataMarks } from '../../xy-data-marks/xy-data-marks';

export class XyDataMarksStub<Datum> extends VicXyDataMarks<
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
  override drawMarks(): void {
    return;
  }
}
