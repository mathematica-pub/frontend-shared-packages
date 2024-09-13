import { MarksOptions } from '../../marks/config/marks-options';
import { Stroke } from '../../stroke/stroke';
import { QuantitativeRulesLabels } from './labels/quantitative-rules-labels';
import { QuantitativeRulesDimensions } from './quantitative-rules-dimensions';

export interface QuantitativeRulesOptions<Datum extends number | Date>
  extends MarksOptions<Datum> {
  color: (d: Datum) => string;
  stroke: Stroke;
  dimensions: QuantitativeRulesDimensions;
  labels: QuantitativeRulesLabels<Datum>;
}
