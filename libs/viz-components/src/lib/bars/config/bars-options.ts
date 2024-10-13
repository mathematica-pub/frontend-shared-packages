import { DataValue } from '../../core/types/values';
import { CategoricalDimension } from '../../data-dimensions/categorical/categorical';
import { OrdinalDimension } from '../../data-dimensions/ordinal/ordinal';
import { QuantitativeNumericDimension } from '../../data-dimensions/quantitative/quantitative-numeric';
import { MarksOptions } from '../../marks/config/marks-options';
import { BarsLabels } from './labels/bars-labels';

export interface BarsOptions<Datum, TOrdinalValue extends DataValue>
  extends MarksOptions<Datum> {
  categorical: CategoricalDimension<Datum, string>;
  ordinal: OrdinalDimension<Datum, TOrdinalValue>;
  quantitative: QuantitativeNumericDimension<Datum>;
  labels: BarsLabels<Datum>;
}
