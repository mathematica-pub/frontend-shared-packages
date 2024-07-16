import { VicAttributeDataDimensionOptions } from '../attribute-data/attribute-data-dimension-options';

export interface CalculatedRangeBinsAttributeDataDimensionOptions<
  Datum,
  RangeValue extends string | number = string
> extends VicAttributeDataDimensionOptions<Datum, number, RangeValue> {
  formatSpecifier: string;
}
