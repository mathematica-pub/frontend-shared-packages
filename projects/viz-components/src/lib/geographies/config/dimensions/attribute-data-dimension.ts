import { VicDataValue } from '../../../core/types/values';
import { VicFillPattern } from '../../../data-dimensions/categorical/fill-pattern';
import {
  VicDataDimension,
  VicDataDimensionOptions,
} from '../../../data-dimensions/dimension';

export interface VicAttributeDataDimensionOptions<
  Datum,
  AttributeValue extends VicDataValue,
  RangeValue extends string | number = string
> extends VicDataDimensionOptions<Datum, AttributeValue> {
  geoAccessor: (d: Datum) => string;
  nullColor: string;
  range: RangeValue[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: (...args: any) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interpolator: (...args: any) => any;
  fillPatterns: VicFillPattern<Datum>[];
}

/**
 * Configuration object for attribute data that will be used to shade the map.
 *
 * The generic parameter is the type of the attribute data.
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geoAccessor: (d: Datum) => any;
  nullColor: string;
  range: RangeValue[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: (...args: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interpolator: (...args: any) => any;
  fillPatterns: VicFillPattern<Datum>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract getScale(): any;
}
