import { DataValue } from '../../../../../../core/types/values';
import { DataDimension } from '../../../../../../data-dimensions/dimension';
import { BinStrategy } from '../attribute-data-bin-enums';
import { AttributeDataDimensionOptions } from './attribute-data-dimension-options';

/**
 * Configuration object for attribute data that will be used to shade the map.
 *
 * The first generic parameter is the type of the attribute data.
 */
export abstract class AttributeDataDimension<
    Datum,
    AttributeValue extends DataValue,
    RangeValue extends string | number = string,
  >
  extends DataDimension<Datum, AttributeValue>
  implements AttributeDataDimensionOptions<Datum, AttributeValue, RangeValue>
{
  binType: BinStrategy;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interpolator: (...args: any) => any;
  nullColor: string;
  range: RangeValue[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: (...args: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract getScale(): any;

  constructor(dimensionType: 'number' | 'ordinal' | 'date') {
    super(dimensionType);
  }
}
