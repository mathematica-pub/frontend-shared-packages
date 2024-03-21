import { Chart } from '../../chart/chart';
import { XyDataMarksValues } from '../../xy-data-marks/xy-data-marks';

export class LinesComponentStub {
  ranges = {
    x: [],
    y: [],
  };
  values = new XyDataMarksValues();
  xScale;
  yScale;
  markers;
  lines;
  hoverDot;
  chart = new Chart();
}
