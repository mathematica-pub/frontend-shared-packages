import { CalculatedRangeBinsAttributeDataDimensionOptions } from '../calculated-bins/calculated-bins-options';

export interface VicCustomBreaksAttributeDataDimensionOptions<
  Datum,
  RangeValue extends string | number = string
> extends CalculatedRangeBinsAttributeDataDimensionOptions<Datum, RangeValue> {
  breakValues: number[];
  formatSpecifier: string;
}
