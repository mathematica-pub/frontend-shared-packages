import { CalculatedRangeBinsAttributeDataDimensionOptions } from '../calculated-bins/calculated-bins-options';

export interface VicEqualFrequenciesAttributeDataDimensionOptions<
  Datum,
  RangeValue extends string | number = string
> extends CalculatedRangeBinsAttributeDataDimensionOptions<Datum, RangeValue> {
  numBins: number;
}
