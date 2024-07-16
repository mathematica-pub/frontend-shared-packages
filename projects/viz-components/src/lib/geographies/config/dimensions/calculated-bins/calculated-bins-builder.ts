import { AttributeDataDimensionBuilder } from '../attribute-data/attribute-data-dimension-builder';

export abstract class CalculatedBinsBuilder<
  Datum,
  RangeValue extends string | number = string
> extends AttributeDataDimensionBuilder<Datum, number, RangeValue> {
  /**
   * A format specifier that will be applied to the value of this dimension for display purposes.
   */
  protected _formatSpecifier: string;

  formatSpecifier(formatSpecifier: string): this {
    this._formatSpecifier = formatSpecifier;
    return this;
  }
}
