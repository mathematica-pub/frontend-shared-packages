import { OrdinalVisualValueDimension } from '../../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { StrokeBase } from '../../../stroke/base/stroke-base';

export interface LinesStrokeOptions<Datum> extends StrokeBase {
  color: OrdinalVisualValueDimension<Datum, string, string>;
}
