import { Chart } from '../chart/chart';
import { Ranges } from '../chart/chart.component';
import { VicDataMarksConfig } from './data-marks.config';

export class DataMarks {
  chart: Chart;
  config: VicDataMarksConfig;
  ranges: Ranges;
  setMethodsFromConfigAndDraw: () => void;
  resizeMarks: () => void;
  drawMarks: (transitionDuration: number) => void;
}
