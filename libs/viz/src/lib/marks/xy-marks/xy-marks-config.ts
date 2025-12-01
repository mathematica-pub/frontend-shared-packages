import { DataMarksConfig } from '../config/marks-config';

export abstract class XyMarksConfig<Datum> extends DataMarksConfig<Datum> {
  valueIndices: number[];
}
