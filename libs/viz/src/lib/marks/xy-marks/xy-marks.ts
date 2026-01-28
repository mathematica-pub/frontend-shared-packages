import {
  XyChartComponent,
  XyChartScales,
} from '../../charts/xy-chart/xy-chart.component';

export interface XyMarks {
  chart: XyChartComponent;
  scales: XyChartScales;
  subscribeToScales: () => void;
}
