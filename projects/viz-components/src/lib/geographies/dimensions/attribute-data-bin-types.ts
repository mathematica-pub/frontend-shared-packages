import { VicCategoricalAttributeDataDimension } from './categorical-bins';
import { VicCustomBreaksAttributeDataDimension } from './custom-breaks-bins';
import { VicEqualNumObservationsAttributeDataDimension } from './equal-num-observations-bins';
import { VicEqualValuesAttributeDataDimension } from './equal-value-ranges-bins';
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
  | VicCategoricalAttributeDataDimension<Datum>
  | VicNoBinsAttributeDataDimensionConfig<Datum>
  | VicEqualValuesAttributeDataDimension<Datum>
  | VicEqualNumObservationsAttributeDataDimension<Datum>
  | VicCustomBreaksAttributeDataDimension<Datum>;
