import { DataMarksConfig } from '../data-marks/config/data-marks-config';

export abstract class VicXyDataMarksConfig<
  Datum
> extends DataMarksConfig<Datum> {
  valueIndices: number[];
}
