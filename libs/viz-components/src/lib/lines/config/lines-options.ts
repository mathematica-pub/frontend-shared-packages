import { CurveFactory } from 'd3';
import { OrdinalVisualValueDimension } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { DateChartPositionDimension } from '../../data-dimensions/quantitative/date-chart-position/date-chart-position';
import { NumberChartPositionDimension } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position';
import { MarksOptions } from '../../marks/config/marks-options';
import { PointMarkers } from '../../point-markers/point-markers';
import { Stroke } from '../../stroke/stroke';
import { AreaFills } from './area-fills/area-fills';

export interface LinesOptions<Datum> extends MarksOptions<Datum> {
  areaFills: AreaFills<Datum>;
  categorical: OrdinalVisualValueDimension<Datum, string>;
  curve: CurveFactory;
  labelLines: boolean;
  lineLabelsFormat: (d: string) => string;
  pointerDetectionRadius: number;
  pointMarkers: PointMarkers<Datum>;
  stroke: Stroke;
  x: DateChartPositionDimension<Datum> | NumberChartPositionDimension<Datum>;
  y: NumberChartPositionDimension<Datum>;
}
