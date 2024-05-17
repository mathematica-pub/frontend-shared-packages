import { VicDataMarks } from '../../data-marks/data-marks';
import { VicDataMarksOptions } from '../../data-marks/data-marks-types';

export class DataMarksStub<Datum> extends VicDataMarks<
  Datum,
  VicDataMarksOptions<Datum>
> {
  override drawMarks(): void {
    return;
  }
  override getTransitionDuration(): number {
    throw new Error('Method not implemented.');
  }
  override setPropertiesFromRanges(useTransition: boolean): void {
    return;
  }
}
