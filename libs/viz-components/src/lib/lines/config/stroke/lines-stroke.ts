import { safeAssign } from '@hsi/app-dev-kit';
import { OrdinalVisualValueDimension } from '../../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { StrokeBase } from '../../../stroke/base/stroke-base';
import { LinesStrokeOptions } from './lines-stroke-options';
export class LinesStroke<Datum>
  extends StrokeBase
  implements LinesStrokeOptions<Datum>
{
  color: OrdinalVisualValueDimension<Datum, string, string>;

  constructor(options: Partial<LinesStrokeOptions<Datum>>) {
    super();
    safeAssign(this, options);
  }
}
