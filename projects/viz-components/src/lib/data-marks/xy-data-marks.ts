import { XyChartScales } from '../xy-chart/xy-chart.component';
import { DataMarks } from './data-marks';

export class XyDataMarks extends DataMarks {
  setValueArrays: () => void;
  subscribeToScales: () => void;
  subscribeToRanges: () => void;
  values: XyDataMarksValues;
  scales: XyChartScales;
}

export class XyDataMarksValues {
  x: any[];
  y: any[];
  category: any[];
  indicies: any[];
}
