import { Chart } from '../chart/chart';
import { Ranges } from '../chart/chart.component';

export interface DataMarks {
  chart: Chart;
  ranges: Ranges;
  setPropertiesFromConfig: () => void;
  setPropertiesFromRanges: (useTransition: boolean) => void;
  setValueArrays: () => void;
  resizeMarks: () => void;
  drawMarks: () => void;
}
