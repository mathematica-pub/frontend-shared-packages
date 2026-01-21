import { AttributeDataDimensionOptions } from '../attribute-data/attribute-data-dimension-options';

export interface CategoricalBinsOptions<
  Datum,
  RangeValue extends string | number = string,
> extends AttributeDataDimensionOptions<Datum, RangeValue> {
  domain: string[];
}
