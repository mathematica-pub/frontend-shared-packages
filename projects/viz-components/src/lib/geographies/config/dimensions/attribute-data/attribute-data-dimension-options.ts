import { VicDataValue } from '../../../../core/types/values';
import { VicFillPattern } from '../../../../data-dimensions/categorical/fill-pattern';
import { VicDataDimensionOptions } from '../../../../data-dimensions/dimension-options';

export interface VicAttributeDataDimensionOptions<
  Datum,
  AttributeValue extends VicDataValue,
  RangeValue extends string | number = string
> extends VicDataDimensionOptions<Datum, AttributeValue> {
  fillPatterns: VicFillPattern<Datum>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interpolator: (...args: any) => any;
  nullColor: string;
  range: RangeValue[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: (...args: any) => string;
}
