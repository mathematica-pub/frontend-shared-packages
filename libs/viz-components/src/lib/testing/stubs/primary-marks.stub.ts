import { DataMarksOptions } from '../../marks/config/marks-options';
import { PrimaryMarks } from '../../marks/primary-marks/primary-marks';

export class PrimaryMarksStub<Datum> extends PrimaryMarks<
  Datum,
  DataMarksOptions<Datum>
> {
  override drawMarks(): void {
    return;
  }
  override getTransitionDuration(): number {
    return 0;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override setChartScalesFromRanges(useTransition: boolean): void {
    return;
  }
}
