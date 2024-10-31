import { DataValue } from '../../core/types/values';
import { OrdinalChartPositionDimension } from '../../data-dimensions/ordinal/ordinal-chart-position/ordinal-chart-position';
import { OrdinalVisualValueDimension } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { NumberChartPositionDimension } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position';
import { MarksOptions } from '../../marks/config/marks-options';
import { BarsLabels } from './labels/bars-labels';

export interface BarsOptions<Datum, TOrdinalValue extends DataValue>
  extends MarksOptions<Datum> {
  color: OrdinalVisualValueDimension<Datum, string>;
  ordinal: OrdinalChartPositionDimension<Datum, TOrdinalValue>;
  quantitative: NumberChartPositionDimension<Datum>;
  labels: BarsLabels<Datum>;
}
