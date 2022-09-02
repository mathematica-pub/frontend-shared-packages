import { Chart } from '../chart/chart';
import { Ranges } from '../chart/chart.component';
import { DataMarksConfig } from './data-marks.config';

export class DataMarks {
  chart: Chart;
  config: DataMarksConfig;
  ranges: Ranges;
  setMethodsFromConfigAndDraw: () => void;
  resizeMarks: () => void;
  drawMarks: (transitionDuration: number) => void;
}
