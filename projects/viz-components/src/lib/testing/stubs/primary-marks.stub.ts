import { PrimaryMarksOptions } from '../../marks/primary-marks/config/primary-marks-options';
import { PrimaryMarks } from '../../marks/primary-marks/primary-marks';

export class PrimaryMarksStub<Datum> extends PrimaryMarks<
  Datum,
  PrimaryMarksOptions<Datum>
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
