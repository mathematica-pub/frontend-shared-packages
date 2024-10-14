import { NumberChartPositionDimension } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position';
import { MarksOptions } from '../../marks/config/marks-options';
import { Stroke } from '../../stroke/stroke';

export interface DotsOptions<Datum> extends MarksOptions<Datum> {
  fill: string;
  pointerDetectionRadius: number;
  radius: number;
  stroke: Stroke;
  x: NumberChartPositionDimension<Datum>;
  y: NumberChartPositionDimension<Datum>;
}
