import { CalculatedBinsAttributeDataDimensionOptions } from '../calculated-bins/calculated-bins-options';

export interface EqualFrequenciesAttributeDataDimensionOptions<
  Datum,
  RangeValue extends string | number = string,
> extends CalculatedBinsAttributeDataDimensionOptions<Datum, RangeValue> {
  numBins: number;
}
