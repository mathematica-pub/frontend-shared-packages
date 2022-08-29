export type VizComponentType = keyof typeof VizComponent;

export const enum VizComponent {
  bars = 'bars',
  chart = 'chart',
  htmlTooltip = 'html-tooltip',
  lines = 'lines',
  map = 'map',
  xAxis = 'x-axis',
  xyChartBackground = 'xy-chart-background',
  xyChartSpace = 'xy-chart-space',
  yAxis = 'y-axis',
}
