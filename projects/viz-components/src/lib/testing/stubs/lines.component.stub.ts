import { XyDataMarksValues } from '../../data-marks/xy-data-marks';

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
}
