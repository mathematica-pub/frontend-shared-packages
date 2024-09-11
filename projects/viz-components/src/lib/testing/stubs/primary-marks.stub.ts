import { MarksOptions } from '../../marks/config/marks-options';
import { VicPrimaryMarks } from '../../marks/primary-marks/primary-marks';

export class PrimaryMarksStub<Datum> extends VicPrimaryMarks<
  Datum,
  MarksOptions<Datum>
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
