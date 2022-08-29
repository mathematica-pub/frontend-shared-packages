export type VizComponentType = keyof typeof VizComponent;

export const enum VizComponent {
  xOrdinalAxis = 'x-ordinal-axis',
  xQuantitativeAxis = 'x-quantitative-axis',
  yOrdinalAxis = 'y-ordinal-axis',
  yQuantitativeAxis = 'y-quantitative-axis',
  bars = 'bars',
  chart = 'chart',
  geographies = 'geographies',
  groupedBars = 'grouped-bars',
  htmlTooltip = 'html-tooltip',
  lines = 'lines',
  mapChart = 'map-chart',
  mapLegend = 'map-legend',
  stackedArea = 'stacked-area',
  stackedBars = 'stacked-bars',
  xyBackground = 'xy-background',
  xyChart = 'xy-chart',
}
