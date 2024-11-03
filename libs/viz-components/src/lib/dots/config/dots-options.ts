import { DateChartPositionDimension } from '../../data-dimensions/continuous-quantitative/date-chart-position/date-chart-position';
import { NumberChartPositionDimension } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position';
import { NumberVisualValueDimension } from '../../data-dimensions/continuous-quantitative/number-visual-value/number-visual-value';
import { OrdinalVisualValueDimension } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { MarksOptions } from '../../marks/config/marks-options';
import { Stroke } from '../../stroke/stroke';

export interface DotsOptions<Datum> extends MarksOptions<Datum> {
  fill:
    | OrdinalVisualValueDimension<Datum, string, string>
    | NumberVisualValueDimension<Datum, string>;
  key: (datum: Datum) => string;
  opacity: number;
  pointerDetectionRadius: number;
  radius:
    | OrdinalVisualValueDimension<Datum, string, number>
    | NumberVisualValueDimension<Datum, number>;
  stroke: Stroke;
  x: NumberChartPositionDimension<Datum> | DateChartPositionDimension<Datum>;
  y: NumberChartPositionDimension<Datum>;
}
