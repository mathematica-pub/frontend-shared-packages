import { DataValue } from '../../core/types/values';
import { NumberChartPositionDimension } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position';
import { OrdinalChartPositionDimension } from '../../data-dimensions/ordinal/ordinal-chart-position/ordinal-chart-position';
import { OrdinalVisualValueDimension } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { MarksOptions } from '../../marks/config/marks-options';
import { BarsLabels } from './labels/bars-labels';

export interface BarsOptions<Datum, OrdinalDomain extends DataValue>
  extends MarksOptions<Datum> {
  color: OrdinalVisualValueDimension<Datum, string, string>;
  ordinal: OrdinalChartPositionDimension<Datum, OrdinalDomain>;
  quantitative: NumberChartPositionDimension<Datum>;
  labels: BarsLabels<Datum>;
}
