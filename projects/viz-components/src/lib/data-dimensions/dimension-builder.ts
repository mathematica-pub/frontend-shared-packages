import { VicDataValue } from '../../public-api';

export abstract class DataDimensionBuilder<
  Datum,
  TDataValue extends VicDataValue
> {
  protected _formatFunction: (d: Datum) => string;
  protected _valueAccessor: (d: Datum) => TDataValue;

  /**
   * Sets a function that will be applied to the value of this dimension for display purposes. If provided, this function will be used instead of the format specifier (available only for quantitative dimensions)
   */
  formatFunction(formatFunction: (d: Datum) => string): this {
    this._formatFunction = formatFunction;
    return this;
  }

  /**
   * Sets a user-provided method that extracts the value for this dimension from a datum. If the dimension is continuous (number of Date), a user *must* provide this method.
   */
  valueAccessor(valueAccessor: (d: Datum) => TDataValue): this {
    this._valueAccessor = valueAccessor;
    return this;
  }
}
