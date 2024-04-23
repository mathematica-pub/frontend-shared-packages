import { VicDataMarksConfig } from '../../data-marks/data-marks.config';
import { XyDataMarksBase } from '../../xy-data-marks/xy-data-marks-base';

export class XyDataMarksBaseStub<Datum> extends XyDataMarksBase<
  Datum,
  VicDataMarksConfig<Datum>
> {
  override setPropertiesFromConfig(): void {
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
