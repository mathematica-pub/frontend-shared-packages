import { DataValue } from '../core/types/values';

export abstract class DataDimensionBuilder<
  Datum,
  TDataValue extends DataValue,
> {
  protected _formatFunction: (d: Datum) => string;
  protected _valueAccessor: (d: Datum) => TDataValue;

  /**
   * OPTIONAL. A function that will be called to format the values of the dimension.
   *
   * If provided, this function will be used instead of the format specifier (available only for quantitative dimensions)
   *
   * @param formatFunction A function that takes a `Datum` and returns a value of type `string`.
   */
  formatFunction(formatFunction: null): this;
  formatFunction(formatFunction: (d: Datum) => string): this;
  formatFunction(formatFunction: ((d: Datum) => string) | null): this {
    if (formatFunction === null) {
      this._formatFunction = undefined;
      return this;
    }
    this._formatFunction = formatFunction;
    return this;
  }

  /**
   * Specifies how values are derived from `Datum` to be used for establishing properties of the chart.
   *
   * REQUIRED. for quantitative dimensions.
   *
   * OPTIONAL. for categorical and ordinal dimensions, though if not provided, the properties of those dimensions cannot reflect the data values.
   *
   * @param valueAccessor A function that takes a `Datum` and returns a value of type `number`, `string`, or `Date`.
   */
  valueAccessor(valueAccessor: (d: Datum) => TDataValue): this {
    this._valueAccessor = valueAccessor;
    return this;
  }

  protected validateValueAccessor(dimensionName: string): void {
    if (!this._valueAccessor) {
      throw new Error(
        `${dimensionName} Dimension: valueAccessor is required. Please use method 'valueAccessor' to set it.`
      );
    }
  }
}
