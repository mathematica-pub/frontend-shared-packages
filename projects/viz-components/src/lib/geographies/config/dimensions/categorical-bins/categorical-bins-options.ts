import { VicAttributeDataDimensionOptions } from '../attribute-data/attribute-data-dimension-options';

export interface VicCategoricalAttributeDataDimensionOptions<
  Datum,
  RangeValue extends string | number = string
> extends VicAttributeDataDimensionOptions<Datum, RangeValue> {
  domain: string[];
}
