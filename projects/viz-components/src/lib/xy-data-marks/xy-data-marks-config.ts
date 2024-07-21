import { DataMarksConfig } from '../data-marks/config/data-marks-config';

export abstract class XyDataMarksConfig<Datum> extends DataMarksConfig<Datum> {
  valueIndices: number[];
}
