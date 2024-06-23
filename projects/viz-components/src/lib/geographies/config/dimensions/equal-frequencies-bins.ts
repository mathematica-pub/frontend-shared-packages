import { interpolateLab, scaleQuantile } from 'd3';
import { VicValuesBin } from './attribute-data-bin-types';
import {
  CalculatedRangeBinsAttributeDataDimension,
  CalculatedRangeBinsAttributeDataDimensionOptions,
} from './calculated-bins';

const DEFAULT = {
  interpolator: interpolateLab,
  nullColor: 'whitesmoke',
  numBins: 4,
  range: ['white', 'blue'],
  scale: scaleQuantile,
};

export interface VicEqualFrequenciesAttributeDataDimensionOptions<
  Datum,
  RangeValue extends string | number = string
> extends CalculatedRangeBinsAttributeDataDimensionOptions<Datum, RangeValue> {
  /**
   * A format specifier that will be applied to the value of this dimension for display purposes.
   */
  formatSpecifier: string;
  numBins: number;
}

/**
 * Configuration object for attribute data that is quantitative and will be binned into equal number of observations. For example, if the data is [0, 1, 2, 4, 60, 100] and numBins is 2, the bin ranges will be [0, 2] and [4, 100].
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicEqualFrequenciesAttributeDataDimension<
    Datum,
    RangeValue extends string | number = string
  >
  extends CalculatedRangeBinsAttributeDataDimension<Datum, RangeValue>
  implements
    VicEqualFrequenciesAttributeDataDimensionOptions<Datum, RangeValue>
{
  readonly binType: VicValuesBin.equalFrequencies;
  private calculatedDomain: number[];
  readonly numBins: number;

  constructor(
    options?: Partial<
      VicEqualFrequenciesAttributeDataDimensionOptions<Datum, RangeValue>
    >
  ) {
    super();
    this.binType = VicValuesBin.equalFrequencies;
    Object.assign(this, DEFAULT, options);
    if (!this.valueAccessor) {
      console.error(
        'Value accessor is required for EqualNumObservationsAttributeDataDimension'
      );
    }
  }

  setPropertiesFromData(data: Datum[]): void {
    const values = data.map(this.valueAccessor);
    this.setDomain(values);
    this.setNumBins();
    this.setRange();
  }

  protected setDomain(values: number[]): void {
    this.calculatedDomain = values;
  }

  private setNumBins(): void {
    this.calculatedNumBins = this.numBins;
  }

  getScale() {
    return this.scale()
      .domain(this.calculatedDomain)
      .range(this.range)
      .unknown(this.nullColor);
  }
}
