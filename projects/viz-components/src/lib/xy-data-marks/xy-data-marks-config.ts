import { VicDataMarksConfig } from '../data-marks/data-marks-types';

export abstract class VicXyDataMarksConfig<
  Datum
> extends VicDataMarksConfig<Datum> {
  valueIndicies: number[];
}
