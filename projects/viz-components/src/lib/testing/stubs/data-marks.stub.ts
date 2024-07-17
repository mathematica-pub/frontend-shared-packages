import { VicDataMarksOptions } from '../../data-marks/config/data-marks-config';
import { VicDataMarks } from '../../data-marks/data-marks-component';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override setPropertiesFromRanges(useTransition: boolean): void {
    return;
  }
}
