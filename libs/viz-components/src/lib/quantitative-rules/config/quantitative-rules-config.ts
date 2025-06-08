import { safeAssign } from '@hsi/app-dev-kit';
import { AuxMarksConfig } from '../../marks';
import { Stroke } from '../../stroke/stroke';
import { QuantitativeRulesLabels } from './labels/quantitative-rules-labels';
import { QuantitativeRulesDimensions } from './quantitative-rules-dimensions';
import { QuantitativeRulesOptions } from './quantitative-rules-options';

export class QuantitativeRulesConfig<Datum extends number | Date>
  extends AuxMarksConfig<Datum>
  implements QuantitativeRulesOptions<Datum>
{
  color: (d: Datum) => string;
  readonly dimensions: QuantitativeRulesDimensions;
  labels: QuantitativeRulesLabels<Datum>;
  stroke: Stroke;

  constructor(options: QuantitativeRulesOptions<Datum>) {
    super();
    safeAssign(this, options);
  }
}
