import { VicDataValue } from '../../../../core/types/values';
import { VicFillPattern } from '../../../../data-dimensions/categorical/fill-pattern';
import { VicDataDimension } from '../../../../data-dimensions/dimension';
import { VicAttributeDataDimensionOptions } from './attribute-data-dimension-options';

/**
 * Configuration object for attribute data that will be used to shade the map.
 *
 * The first generic parameter is the type of the attribute data.
 */
export abstract class AttributeDataDimension<
    Datum,
    AttributeValue extends VicDataValue,
    RangeValue extends string | number = string
  >
  extends VicDataDimension<Datum, AttributeValue>
  implements
    VicAttributeDataDimensionOptions<Datum, AttributeValue, RangeValue>
{
  fillPatterns: VicFillPattern<Datum>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interpolator: (...args: any) => any;
  nullColor: string;
  range: RangeValue[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: (...args: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract getScale(): any;
}
