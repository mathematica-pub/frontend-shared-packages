import { map } from 'd3';
import { VicDataValue } from '../../core/types/values';
import { VicFormatSpecifier } from '../../core/utilities/value-format';

export interface VicDataDimensionOptions<
  Datum,
  TDataValue extends VicDataValue
> {
  /**
   * A user-provided method that extracts the value for this dimension from a datum.
   */
  valueAccessor: (d: Datum, ...args: any) => TDataValue;
  /**
   * A formatter (function or string) for the values of this dimension.
   */
  valueFormat?: VicFormatSpecifier<Datum>;
}

export abstract class VicDataDimension<Datum, TDataValue extends VicDataValue>
  implements VicDataDimensionOptions<Datum, TDataValue>
{
  valueAccessor: (d: Datum, ...args: any) => TDataValue;
  valueFormat?: VicFormatSpecifier<Datum>;
  /**
   * An array of values for this dimension, extracted from the data using the value accessor.
   * @see {@link valueAccessor}
   */
  values: TDataValue[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract setPropertiesFromData(data: Datum[], ...args: any): void;

  protected setValues(data: Datum[]): void {
    this.values = map(data, this.valueAccessor);
  }
}
