import { VicValuesBin } from './attribute-data-bin-enums';
import { VicCategoricalAttributeDataDimension } from './categorical-bins/categorical-bins';
import { VicCustomBreaksAttributeDataDimension } from './custom-breaks/custom-breaks-bins';
import { VicEqualFrequenciesAttributeDataDimension } from './equal-frequencies-bins/equal-frequencies-bins';
import { VicEqualValueRangesAttributeDataDimension } from './equal-value-ranges-bins/equal-value-ranges-bins';
import { VicNoBinsAttributeDataDimension } from './no-bins/no-bins';

export type VicNumberValuesBin = Omit<VicValuesBin, VicValuesBin.categorical>;

export type VicAttributeDataDimensionConfig<Datum> =
  | VicCategoricalAttributeDataDimension<Datum>
  | VicNoBinsAttributeDataDimension<Datum>
  | VicEqualValueRangesAttributeDataDimension<Datum>
  | VicEqualFrequenciesAttributeDataDimension<Datum>
  | VicCustomBreaksAttributeDataDimension<Datum>;
