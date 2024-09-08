import { Stroke } from '../../stroke/stroke';
import { XyMarksConfig } from '../../xy-marks/xy-marks-config';
import { QuantitativeRulesLabels } from './labels/quantitative-rules-labels';
import { QuantitativeRulesDimensions } from './quantitative-rules-dimensions';
import { QuantitativeRulesOptions } from './quantitative-rules-options';

export class QuantitativeRulesConfig<Datum extends number | Date>
  extends XyMarksConfig<Datum>
  implements QuantitativeRulesOptions<Datum>
{
  readonly dimensions: QuantitativeRulesDimensions;
  color: (d: Datum) => string;
  labels: QuantitativeRulesLabels<Datum>;
  stroke: Stroke;

  constructor(options: QuantitativeRulesOptions<Datum>) {
    super();
    Object.assign(this, options);
  }
}
