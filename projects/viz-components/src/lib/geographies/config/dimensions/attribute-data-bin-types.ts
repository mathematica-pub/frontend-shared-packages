import { VicCategoricalAttributeDataDimension } from './categorical-bins/categorical-bins';
import { VicCustomBreaksAttributeDataDimension } from './custom-breaks/custom-breaks-bins';
import { VicEqualFrequenciesAttributeDataDimension } from './equal-frequencies-bins/equal-frequencies-bins';
import { VicEqualValueRangesAttributeDataDimension } from './equal-value-ranges-bins/equal-value-ranges-bins';
import { VicNoBinsAttributeDataDimension } from './no-bins/no-bins';

/**
 * Enum that defines the types of binning that can be used to map quantitative attribute data to colors.
 */
export enum VicValuesBin {
  none = 'none',
  categorical = 'categorical',
  equalValueRanges = 'equalValueRanges',
  equalFrequencies = 'equalFrequencies',
  customBreaks = 'customBreaks',
}

export type VicNumberValuesBin = Omit<VicValuesBin, VicValuesBin.categorical>;

export type VicAttributeDataDimensionConfig<Datum> =
  | VicCategoricalAttributeDataDimension<Datum>
  | VicNoBinsAttributeDataDimension<Datum>
  | VicEqualValueRangesAttributeDataDimension<Datum>
  | VicEqualFrequenciesAttributeDataDimension<Datum>
  | VicCustomBreaksAttributeDataDimension<Datum>;
