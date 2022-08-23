export type DocumentationTypeOption = keyof typeof DocumentationType;

export const enum DocumentationType {
    Bars = 'Bars',
    Chart = 'Chart',
    ContinuousLegend = 'ContinuousLegend',
    DiscontinuousLegend = 'DiscontinuousLegend',
    Geographies = 'Geographies',
    GroupedBars = 'GroupedBars',
    HtmlTooltip = 'HtmlTooltip',
    Lines = 'Lines',
    MapChart = 'MapChart',
    Map = 'Map',
    MapLegend = 'MapLegend',
    StackedBars = 'StackedBars',
    XOrdinalAxis = 'XOrdinalAxis',
    XQuantitativeAxis = 'XQuantitativeAxis',
    XyChartBackground = 'XyChartBackground',
    XyChart = 'XyChart',
    XyChartSpace = 'XyChartSpace',
    YOrdinalAxis = 'YOrdinalAxis',
    YQuantitativeAxis = 'YQuantitativeAxis',
    StackedArea = 'StackedArea',
}