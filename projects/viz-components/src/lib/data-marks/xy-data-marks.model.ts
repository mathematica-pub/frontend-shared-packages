import { Ranges } from '../chart/chart.model';
import { DataMarks } from './data-marks.model';

export class XyDataMarks extends DataMarks {
  setValueArrays: () => void;
  subscribeToScales: () => void;
  subscribeToRanges: () => void;
  values: XyDataMarksValues;
  xScale: (d: any) => any;
  yScale: (d: any) => any;
  ranges: Ranges;
}

export class XyDataMarksValues {
  x: any[];
  y: any[];
  category: any[];
  indicies: any[];
}
