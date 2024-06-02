import { VicDataMarks } from '../../data-marks/data-marks';
import { VicDataOptions } from '../../data-marks/data-marks.config';

export class DataMarksStub<Datum> extends VicDataMarks<
  Datum,
  VicDataOptions<Datum>
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
