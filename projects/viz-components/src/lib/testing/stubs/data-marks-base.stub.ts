import { VicDataMarks } from '../../data-marks/data-marks';
import { VicDataMarksConfig } from '../../data-marks/data-marks.config';

export class DataMarksBaseStub<Datum> extends VicDataMarks<
  Datum,
  VicDataMarksConfig<Datum>
> {
  override setPropertiesFromData(): void {
    return;
  }
  override setPropertiesFromRanges(useTransition: boolean): void {
    return;
  }
  override setDimensionPropertiesFromData(): void {
    return;
  }
  override drawMarks(): void {
    return;
  }
  override resizeMarks(): void {
    return;
  }
}
