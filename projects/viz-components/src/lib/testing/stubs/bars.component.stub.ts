import { Chart } from '../../chart/chart';
import { XyDataMarksValues } from '../../xy-data-marks/xy-data-marks';

export class BarsComponentStub {
  ranges = {
    x: [],
    y: [],
  };
  values = new XyDataMarksValues();
  xScale;
  yScale;
  bars;
  chart = new Chart();
}
