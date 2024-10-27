import { CurveFactory } from 'd3';
import { CategoricalDimension } from '../../data-dimensions/categorical/categorical';
import { DateChartPositionDimension } from '../../data-dimensions/quantitative/date-chart-position/date-chart-position';
import { QuantitativeNumericDimension } from '../../data-dimensions/quantitative/quantitative-numeric';
import { MarksOptions } from '../../marks/config/marks-options';
import { PointMarkers } from '../../point-markers/point-markers';
import { Stroke } from '../../stroke/stroke';
import { AreaFills } from './area-fills/area-fills';

export interface LinesOptions<Datum> extends MarksOptions<Datum> {
  areaFills: AreaFills<Datum>;
  categorical: CategoricalDimension<Datum, string>;
  curve: CurveFactory;
  labelLines: boolean;
  lineLabelsFormat: (d: string) => string;
  pointerDetectionRadius: number;
  pointMarkers: PointMarkers<Datum>;
  stroke: Stroke;
  x: DateChartPositionDimension<Datum> | QuantitativeNumericDimension<Datum>;
  y: QuantitativeNumericDimension<Datum>;
}
