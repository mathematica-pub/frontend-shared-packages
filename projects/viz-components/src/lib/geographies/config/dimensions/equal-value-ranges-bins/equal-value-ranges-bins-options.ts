import { CalculatedBinsAttributeDataDimensionOptions } from '../calculated-bins/calculated-bins-options';

export interface VicEqualValueRangesAttributeDataDimensionOptions<
  Datum,
  RangeValue extends string | number = string
> extends CalculatedBinsAttributeDataDimensionOptions<Datum, RangeValue> {
  domain: [number, number];
  numBins: number;
}
