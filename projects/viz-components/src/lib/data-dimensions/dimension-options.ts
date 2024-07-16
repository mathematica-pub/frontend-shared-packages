import { VicDataValue } from '../../public-api';

export interface VicDataDimensionOptions<
  Datum,
  TDataValue extends VicDataValue
> {
  /**
   * A function that will be applied to the value of this dimension for display purposes. If provided, this function will be used instead of the format specifier (available only for quantitative dimensions)
   */
  formatFunction: (d: Datum) => string;
  /**
   * A user-provided method that extracts the value for this dimension from a datum. If the dimension is continuous (number of Date), a user *must* provide this method.
   */
  valueAccessor: (d: Datum) => TDataValue;
}
