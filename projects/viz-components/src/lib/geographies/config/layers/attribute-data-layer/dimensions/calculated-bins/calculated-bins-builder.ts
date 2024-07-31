import { AttributeDataDimensionBuilder } from '../attribute-data/attribute-data-dimension-builder';

export abstract class CalculatedBinsAttributeDataDimensionBuilder<
  Datum,
  RangeValue extends string | number = string,
> extends AttributeDataDimensionBuilder<Datum, number, RangeValue> {
  protected _formatSpecifier: string;

  /**
   * OPTIONAL. Sets a format specifier that will be applied to the value of this dimension using D3 format for display purposes.
   *
   * For example, this will format data values shown in a tooltip
   */
  formatSpecifier(formatSpecifier: string): this {
    this._formatSpecifier = formatSpecifier;
    return this;
  }
}
