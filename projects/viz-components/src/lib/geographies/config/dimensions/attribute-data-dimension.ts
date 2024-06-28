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
  /**
   * A color that will be used if there are any geojson features provided in this dimension's geographies that do not have attribute data.
   */
  nullColor: string;
  /**
   * An array of values that will be used as the range in the attribute data scale.
   */
  range: RangeValue[];
  /**
   * A function that will be used to create the scale for the attribute data.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: (...args: any) => string;
  /**
   * A function that will be used to create the a new range for the attribute data scale if the user's specified numBins is greater than the values in the user's specified range.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interpolator: (...args: any) => any;
  /**
   * An array of fill patterns that will be applied to the features in this layer with attribute data.
   */
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
