import { AttributeDataDimensionOptions } from '../attribute-data/attribute-data-dimension-options';

export interface CalculatedBinsAttributeDataDimensionOptions<
  Datum,
  RangeValue extends string | number = string
> extends AttributeDataDimensionOptions<Datum, number, RangeValue> {
  formatSpecifier: string;
}
