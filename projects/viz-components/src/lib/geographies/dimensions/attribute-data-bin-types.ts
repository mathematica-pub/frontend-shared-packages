import { VicCategoricalAttributeDataDimensionConfig } from './categorical-bins';
import { VicCustomBreaksAttributeDataDimensionConfig } from './custom-breaks-bins';
import { VicEqualNumbersAttributeDataDimensionConfig } from './equal-num-observations-bins';
import { VicEqualValuesAttributeDataDimensionConfig } from './equal-value-ranges-bins';
import { VicNoBinsAttributeDataDimensionConfig } from './no-bins';

/**
 * Enum that defines the types of binning that can be used to map quantitative attribute data to colors.
 */
export enum VicValuesBin {
  none = 'none',
  categorical = 'categorical',
  equalValueRanges = 'equalValueRanges',
  equalNumObservations = 'equalNumObservations',
  customBreaks = 'customBreaks',
}

export type VicAttributeDataDimensionConfig<Datum> =
  | VicCategoricalAttributeDataDimensionConfig<Datum>
  | VicNoBinsAttributeDataDimensionConfig<Datum>
  | VicEqualValuesAttributeDataDimensionConfig<Datum>
  | VicEqualNumbersAttributeDataDimensionConfig<Datum>
  | VicCustomBreaksAttributeDataDimensionConfig<Datum>;
