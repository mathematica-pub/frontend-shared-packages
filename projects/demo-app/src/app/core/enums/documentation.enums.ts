export type DocumentationType = keyof typeof Documentation;

export const enum Documentation {
    Bars = 'Bars',
    Chart = 'Chart',
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