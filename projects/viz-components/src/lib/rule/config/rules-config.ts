import { Stroke } from '../../marks/stroke/stroke';
import { XyMarksConfig } from '../../xy-marks/xy-marks-config';
import { RulesLabels } from './labels/rules-label';
import { RulesDimensions } from './rules-dimensions';
import { RulesOptions } from './rules-options';

export class RulesConfig<Datum extends number | Date>
  extends XyMarksConfig<Datum>
  implements RulesOptions<Datum>
{
  readonly dimensions: RulesDimensions;
  color: (d: Datum) => string;
  labels: RulesLabels<Datum>;
  stroke: Stroke;

  constructor(options: RulesOptions<Datum>) {
    super();
    Object.assign(this, options);
  }
}
