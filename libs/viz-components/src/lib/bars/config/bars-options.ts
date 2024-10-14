import { DataValue } from '../../core/types/values';
import { CategoricalDimension } from '../../data-dimensions/categorical/categorical';
import { CategoricalChartPositionDimension } from '../../data-dimensions/categorical/categorical-chart-position/categorical-chart-position';
import { NumberChartPositionDimension } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position';
import { MarksOptions } from '../../marks/config/marks-options';
import { BarsLabels } from './labels/bars-labels';

export interface BarsOptions<Datum, TOrdinalValue extends DataValue>
  extends MarksOptions<Datum> {
  color: CategoricalDimension<Datum, string, string>;
  ordinal: CategoricalChartPositionDimension<Datum, TOrdinalValue>;
  quantitative: NumberChartPositionDimension<Datum>;
  labels: BarsLabels<Datum>;
}
