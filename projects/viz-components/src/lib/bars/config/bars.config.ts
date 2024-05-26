import { min, range } from 'd3';
import { VicDataValue } from '../../core/types/values';
import { VicCategoricalDimension } from '../../data-dimensions/categorical-dimension';
import { VicOrdinalDimension } from '../../data-dimensions/ordinal-dimension';
import { VicQuantitativeDimension } from '../../data-dimensions/quantitative-dimension';
import { VicDataMarksOptions } from '../../data-marks/data-marks-types';
import { VicXyDataMarksConfig } from '../../xy-data-marks/xy-data-marks-config';
import {
  HORIZONTAL_BARS_DIMENSIONS,
  VERTICAL_BARS_DIMENSIONS,
  VicBarsDimensions,
} from './bars-dimensions';
import { VicBarsLabels } from './bars-labels';

const DEFAULT = {
  categorical: {
    range: ['lightslategray'],
  },
};

export interface VicBarsOptions<Datum, TOrdinalValue extends VicDataValue>
  extends VicDataMarksOptions<Datum> {
  categorical: VicCategoricalDimension<Datum, string>;
  ordinal: VicOrdinalDimension<Datum, TOrdinalValue>;
  quantitative: VicQuantitativeDimension<Datum>;
  labels: VicBarsLabels<Datum>;
}

export class VicBarsConfig<Datum, TOrdinalValue extends VicDataValue>
  extends VicXyDataMarksConfig<Datum>
  implements VicBarsOptions<Datum, TOrdinalValue>
{
  barsKeyFunction: (i: number) => string;
  readonly categorical: VicCategoricalDimension<Datum, string>;
  readonly dimensions: VicBarsDimensions;
  hasBarsWithNegativeValues: boolean;
  readonly labels: VicBarsLabels<Datum>;
  readonly ordinal: VicOrdinalDimension<Datum, TOrdinalValue>;
  readonly quantitative: VicQuantitativeDimension<Datum>;

  constructor(
    dimensions: VicBarsDimensions,
    options: Partial<VicBarsOptions<Datum, TOrdinalValue>>
  ) {
    super();
    Object.assign(this, options);
    this.dimensions = dimensions;
    this.initPropertiesFromData();
  }

  protected initPropertiesFromData(): void {
    this.setDimensionPropertiesFromData();
    this.setValueIndicies();
    this.setHasBarsWithNegativeValues();
    this.setBarsKeyFunction();
  }

  protected setDimensionPropertiesFromData(): void {
    this.quantitative.setPropertiesFromData(this.data);
    this.ordinal.setPropertiesFromData(
      this.data,
      this.dimensions.ordinal === 'y'
    );
    this.categorical.setPropertiesFromData(this.data);
  }

  protected setValueIndicies(): void {
    this.valueIndicies = range(this.ordinal.values.length).filter((i) =>
      this.ordinal.domainIncludes(this.ordinal.values[i])
    );
  }

  protected setHasBarsWithNegativeValues(): void {
    this.hasBarsWithNegativeValues = min(this.quantitative.values) < 0;
  }

  protected setBarsKeyFunction(): void {
    this.barsKeyFunction = (i: number): string => `${this.ordinal.values[i]}`;
  }
}

function vicBars<Datum, TOrdinalValue extends VicDataValue>(
  dimensions: VicBarsDimensions,
  options: Partial<VicBarsOptions<Datum, TOrdinalValue>>
): VicBarsConfig<Datum, TOrdinalValue> {
  return new VicBarsConfig(dimensions, options);
}

/**
 * A function to create a horizontal bars configuration to be used with vic-data-marks-bars component
 * @param {Partial<VicBarsOptions<Datum, TOrdinalValue>>} options - **REQUIRED**
 * @param {VicCategoricalDimension<Datum, string>} options.categorical - **REQUIRED** - specify using vicCategoricalDimension
 * @param {VicOrdinalDimension<Datum, TOrdinalValue>} options.ordinal - **REQUIRED** - specify using vicOrdinalDimension
 * @param {VicQuantitativeDimension<Datum>} options.quantitative - **REQUIRED** - specify using vicQuantitativeDimension
 * @param {VicBarsLabels<Datum>} options.labels - specify using vicBarsLabels
 * @returns
 */
export function vicHorizontalBars<Datum, TOrdinalValue extends VicDataValue>(
  options: Partial<VicBarsOptions<Datum, TOrdinalValue>>
): VicBarsConfig<Datum, TOrdinalValue> {
  return vicBars(HORIZONTAL_BARS_DIMENSIONS, options);
}

/**
 * A function to create a vertical bars configuration to be used with vic-data-marks-bars component
 * @param {Partial<VicBarsOptions<Datum, TOrdinalValue>>} options - **REQUIRED**
 * @param {VicCategoricalDimension<Datum, string>} options.categorical - **REQUIRED** - specify using vicCategoricalDimension
 * @param {VicOrdinalDimension<Datum, TOrdinalValue>} options.ordinal - **REQUIRED** - specify using vicOrdinalDimension
 * @param {VicQuantitativeDimension<Datum>} options.quantitative - **REQUIRED** - specify using vicQuantitativeDimension
 * @param {VicBarsLabels<Datum>} options.labels - specify using vicBarsLabels
 * @returns
 */
export function vicVerticalBars<Datum, TOrdinalValue extends VicDataValue>(
  options: Partial<VicBarsOptions<Datum, TOrdinalValue>>
): VicBarsConfig<Datum, TOrdinalValue> {
  return vicBars(VERTICAL_BARS_DIMENSIONS, options);
}
