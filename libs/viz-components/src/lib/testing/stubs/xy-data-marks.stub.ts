import { XyPrimaryMarksConfig } from '@hsi/viz-components';
import { DataValue } from '../../core/types/values';
import { VicXyPrimaryMarks } from '../../marks/xy-marks/xy-primary-marks/xy-primary-marks';

export class XyPrimaryMarksStub<Datum> extends VicXyPrimaryMarks<
  Datum,
  DataValue,
  XyPrimaryMarksConfig<Datum, DataValue>
> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override setChartScalesFromRanges(useTransition: boolean): void {
    return;
  }
  override drawMarks(): void {
    return;
  }
}
