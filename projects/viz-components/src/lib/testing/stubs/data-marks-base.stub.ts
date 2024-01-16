import { DataMarksBase } from '../../data-marks/data-marks-base';
import { VicDataMarksConfig } from '../../data-marks/data-marks.config';

export class DataMarksBaseStub<T> extends DataMarksBase<
  T,
  VicDataMarksConfig<T>
> {
  override setPropertiesFromConfig(): void {
    return;
  }
  override setPropertiesFromRanges(useTransition: boolean): void {
    return;
  }
  override setValueArrays(): void {
    return;
  }
  override drawMarks(): void {
    return;
  }
  override resizeMarks(): void {
    return;
  }
}
