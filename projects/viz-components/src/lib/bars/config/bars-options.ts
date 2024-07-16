import {
  VicDataValue,
  VicDimensionCategorical,
  VicDimensionOrdinal,
  VicDimensionQuantitativeNumeric,
} from 'projects/viz-components/src/public-api';
import { VicDataMarksOptions } from '../../data-marks/config/data-marks-options';
import { VicBarsLabels } from './labels/bars-labels';

export interface VicBarsOptions<Datum, TOrdinalValue extends VicDataValue>
  extends VicDataMarksOptions<Datum> {
  categorical: VicDimensionCategorical<Datum, string>;
  ordinal: VicDimensionOrdinal<Datum, TOrdinalValue>;
  quantitative: VicDimensionQuantitativeNumeric<Datum>;
  labels: VicBarsLabels<Datum>;
}
