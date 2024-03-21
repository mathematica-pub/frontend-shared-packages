import { Chart } from '../../chart/chart';
import { XyDataMarksValues } from '../../xy-data-marks/xy-data-marks';

export class StackedAreaComponentStub {
  ranges = {
    x: [],
    y: [],
  };
  values = new XyDataMarksValues();
  xScale;
  yScale;
  area;
  areas;
  chart = new Chart();
}
