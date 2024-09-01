import { MarksOptions } from '../../marks/config/marks-options';
import { Stroke } from '../../marks/stroke/stroke';
import { RulesLabels } from './labels/rules-label';
import { RulesDimensions } from './rules-dimensions';

export interface RulesOptions<Datum extends number | Date>
  extends MarksOptions<Datum> {
  color: (d: Datum) => string;
  stroke: Stroke;
  dimensions: RulesDimensions;
  labels: RulesLabels<Datum>;
}
