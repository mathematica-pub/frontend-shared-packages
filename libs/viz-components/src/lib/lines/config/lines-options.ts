import { CurveFactory } from 'd3';
import { DateChartPositionDimension } from '../../data-dimensions/continuous-quantitative/date-chart-position/date-chart-position';
import { NumberChartPositionDimension } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position';
import { MarksOptions } from '../../marks/config/marks-options';
import { PointMarkers } from '../../point-markers/point-markers';
import { AreaFills } from './area-fills/area-fills';
import { LinesStrokeOptions } from './stroke/lines-stroke-options';

export interface LinesOptions<Datum> extends MarksOptions<Datum> {
  areaFills: AreaFills<Datum>;
  curve: CurveFactory;
  labelLines: boolean;
  lineLabelsFormat: (d: string) => string;
  pointerDetectionRadius: number;
  pointMarkers: PointMarkers<Datum>;
  stroke: LinesStrokeOptions<Datum>;
  x: DateChartPositionDimension<Datum> | NumberChartPositionDimension<Datum>;
  y: NumberChartPositionDimension<Datum>;
}
