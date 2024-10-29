import { MarksConfig } from '../config/marks-config';

export abstract class XyMarksConfig<Datum> extends MarksConfig<Datum> {
  valueIndices: number[];
}
