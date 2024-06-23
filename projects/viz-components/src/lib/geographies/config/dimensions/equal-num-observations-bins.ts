import { interpolateLab, scaleQuantile } from 'd3';
import { VicValuesBin } from './attribute-data-bin-types';
import {
  CalculatedRangeBinsAttributeDataDimension,
  CalculatedRangeBinsAttributeDataDimensionOptions,
} from './calculated-bins';

const DEFAULT = {
  interpolator: interpolateLab,
  nullColor: 'whitesmoke',
  numBins: 5,
  scale: scaleQuantile,
};

export interface VicEqualNumObservationsAttributeDataDimensionOptions<
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
export class VicEqualNumObservationsAttributeDataDimension<
    Datum,
    RangeValue extends string | number = string
  >
  extends CalculatedRangeBinsAttributeDataDimension<Datum, RangeValue>
  implements
    VicEqualNumObservationsAttributeDataDimensionOptions<Datum, RangeValue>
{
  readonly binType: VicValuesBin.equalNumObservations;
  private calculatedDomain: number[];
  readonly numBins: number;

  constructor(
    options?: Partial<
      VicEqualNumObservationsAttributeDataDimensionOptions<Datum, RangeValue>
    >
  ) {
    super();
    this.binType = VicValuesBin.equalNumObservations;
    Object.assign(this, DEFAULT, options);
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
