import { VicValuesBin } from './attribute-data-bin-enums';
import { CategoricalBinsAttributeDataDimension } from './categorical-bins/categorical-bins';
import { CustomBreaksBinsAttributeDataDimension } from './custom-breaks/custom-breaks-bins';
import { EqualFrequenciesAttributeDataDimension } from './equal-frequencies-bins/equal-frequencies-bins';
import { VicEqualValueRangesAttributeDataDimension } from './equal-value-ranges-bins/equal-value-ranges-bins';
import { NoBinsAttributeDataDimension } from './no-bins/no-bins';

export type VicNumberValuesBin = Omit<VicValuesBin, VicValuesBin.categorical>;

export type VicAttributeDataDimensionConfig<Datum> =
  | CategoricalBinsAttributeDataDimension<Datum>
  | NoBinsAttributeDataDimension<Datum>
  | VicEqualValueRangesAttributeDataDimension<Datum>
  | EqualFrequenciesAttributeDataDimension<Datum>
  | CustomBreaksBinsAttributeDataDimension<Datum>;
