import { DataMarksOptions } from '../../data-marks/config/data-marks-options';
import { DataMarks } from '../../data-marks/data-marks-base';

export class DataMarksStub<Datum> extends DataMarks<
  Datum,
  DataMarksOptions<Datum>
> {
  override drawMarks(): void {
    return;
  }
  override getTransitionDuration(): number {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override setChartScalesFromRanges(useTransition: boolean): void {
    return;
  }
}
