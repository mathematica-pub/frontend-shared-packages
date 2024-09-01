import { MarksConfig } from '../marks/config/marks-config';

export abstract class XyMarksConfig<Datum> extends MarksConfig<Datum> {
  valueIndices: number[];
}
