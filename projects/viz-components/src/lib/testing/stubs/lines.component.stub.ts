import { Chart } from '../../charts/chart/chart';

export class LinesComponentStub {
  ranges = {
    x: [],
    y: [],
  };
  xScale;
  yScale;
  markers;
  lines;
  hoverDot;
  chart = new Chart();
}
