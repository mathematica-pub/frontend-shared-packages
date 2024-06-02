import { VicDataConfig } from '../data-marks/data-marks.config';

export abstract class VicXyDataMarksConfig<Datum> extends VicDataConfig<Datum> {
  valueIndicies: number[];
}
