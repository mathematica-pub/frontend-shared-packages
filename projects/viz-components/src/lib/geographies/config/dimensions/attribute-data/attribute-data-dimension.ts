import { DataValue } from '../../../../core/types/values';
import { FillPattern } from '../../../../data-dimensions/categorical/fill-pattern';
import { DataDimension } from '../../../../data-dimensions/dimension';
import { AttributeDataDimensionOptions } from './attribute-data-dimension-options';

/**
 * Configuration object for attribute data that will be used to shade the map.
 *
 * The first generic parameter is the type of the attribute data.
 */
export abstract class AttributeDataDimension<
    Datum,
    AttributeValue extends DataValue,
    RangeValue extends string | number = string
  >
  extends DataDimension<Datum, AttributeValue>
  implements AttributeDataDimensionOptions<Datum, AttributeValue, RangeValue>
{
  fillPatterns: FillPattern<Datum>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interpolator: (...args: any) => any;
  nullColor: string;
  range: RangeValue[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: (...args: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract getScale(): any;
}
