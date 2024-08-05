import { CalculatedBinsAttributeDataDimensionOptions } from '../calculated-bins/calculated-bins-options';

export interface CustomBreaksBinsAttributeDataDimensionOptions<
  Datum,
  RangeValue extends string | number = string,
> extends CalculatedBinsAttributeDataDimensionOptions<Datum, RangeValue> {
  breakValues: number[];
  formatSpecifier: string;
}
