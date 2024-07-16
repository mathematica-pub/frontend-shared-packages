import { VicDataMarksConfig } from '../data-marks/config/data-marks-config';

export abstract class VicXyDataMarksConfig<
  Datum
> extends VicDataMarksConfig<Datum> {
  valueIndices: number[];
}
