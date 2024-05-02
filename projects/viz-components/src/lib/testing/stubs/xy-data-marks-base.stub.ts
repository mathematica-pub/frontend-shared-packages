import { VicDataMarksConfig } from '../../data-marks/data-marks.config';
import { VicXyDataMarks } from '../../xy-data-marks/xy-data-marks';

export class XyDataMarksBaseStub<Datum> extends VicXyDataMarks<
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
  override setDimensionPropertiesFromData(): void {
    return;
  }
  override drawMarks(): void {
    return;
  }
}
