import { VicDataMarks } from '../../data-marks/data-marks';
import { VicDataMarksConfig } from '../../data-marks/data-marks-types';

export class DataMarksBaseStub<Datum> extends VicDataMarks<
  Datum,
  VicDataMarksConfig<Datum>
> {
  override getTransitionDuration(): number {
    throw new Error('Method not implemented.');
  }
  override setPropertiesFromData(): void {
    return;
  }
  override setPropertiesFromRanges(useTransition: boolean): void {
    return;
  }
  override drawMarks(): void {
    return;
  }
  override resizeMarks(): void {
    return;
  }
}
