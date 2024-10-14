import { CurveFactory } from 'd3';
import { CategoricalDimension } from '../../data-dimensions/categorical/categorical';
import { DateNumberDimension } from '../../data-dimensions/quantitative/date-number/date-number';
import { NumberChartPositionDimension } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position';
import { MarksOptions } from '../../marks/config/marks-options';
import { PointMarkers } from '../../point-markers/point-markers';
import { Stroke } from '../../stroke/stroke';
import { AreaFills } from './area-fills/area-fills';

export interface LinesOptions<Datum> extends MarksOptions<Datum> {
  areaFills: AreaFills<Datum>;
  color: CategoricalDimension<Datum, string, string>;
  curve: CurveFactory;
  labelLines: boolean;
  lineLabelsFormat: (d: string) => string;
  pointerDetectionRadius: number;
  pointMarkers: PointMarkers<Datum>;
  stroke: Stroke;
  x: DateNumberDimension<Datum> | NumberChartPositionDimension<Datum>;
  y: NumberChartPositionDimension<Datum>;
}
