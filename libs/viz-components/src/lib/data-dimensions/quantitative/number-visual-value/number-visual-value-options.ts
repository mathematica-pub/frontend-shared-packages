import { VisualValue } from '../../../core/types/values';
import { NumberDimensionOptions } from '../number-dimension/number-dimension-options';

export interface NumberVisualValueDimensionOptions<
  Datum,
  Range extends VisualValue,
> extends NumberDimensionOptions<Datum, Range> {
  range: [Range, Range];
  scale: (value: number) => Range;
}
