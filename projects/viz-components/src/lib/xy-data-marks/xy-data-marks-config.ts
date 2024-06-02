import { VicDataMarksConfig } from '../data-marks/data-marks.config';

export abstract class VicXyDataMarksConfig<
  Datum
> extends VicDataMarksConfig<Datum> {
  valueIndicies: number[];
}
