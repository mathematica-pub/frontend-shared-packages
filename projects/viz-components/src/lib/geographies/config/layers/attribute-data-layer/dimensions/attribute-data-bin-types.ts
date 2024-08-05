import { BinStrategy } from './attribute-data-bin-enums';
import { CategoricalBinsAttributeDataDimension } from './categorical-bins/categorical-bins';
import { CustomBreaksBinsAttributeDataDimension } from './custom-breaks/custom-breaks-bins';
import { EqualFrequenciesAttributeDataDimension } from './equal-frequencies-bins/equal-frequencies-bins';
import { EqualValueRangesAttributeDataDimension } from './equal-value-ranges-bins/equal-value-ranges-bins';
import { NoBinsAttributeDataDimension } from './no-bins/no-bins';

export type VicNumberValuesBin = Omit<BinStrategy, BinStrategy.categorical>;

export type VicAttributeDataDimensionConfig<Datum> =
  | CategoricalBinsAttributeDataDimension<Datum>
  | NoBinsAttributeDataDimension<Datum>
  | EqualValueRangesAttributeDataDimension<Datum>
  | EqualFrequenciesAttributeDataDimension<Datum>
  | CustomBreaksBinsAttributeDataDimension<Datum>;
