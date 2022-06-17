import { DataMarks } from './data-marks.model';

export class XyDataMarks extends DataMarks {
  setValueArrays: () => void;
  subscribeToScales: () => void;
  subscribeToRanges: () => void;
  values: XYDataMarksValues;
  xScale: (d: any) => any;
  yScale: (d: any) => any;
}

export class XYDataMarksValues {
  x: any[];
  y: any[];
  category: any[];
  indicies: any[];
}
