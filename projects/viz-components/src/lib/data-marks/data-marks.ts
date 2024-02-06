import { Chart } from '../chart/chart';
import { Ranges } from '../chart/chart.component';
import { VicDataMarksConfig } from './data-marks.config';

export class DataMarks {
  chart: Chart;
  config: VicDataMarksConfig;
  ranges: Ranges;
  setPropertiesFromConfig: () => void;
  resizeMarks: () => void;
  drawMarks: () => void;
}
