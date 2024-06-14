import { interpolateLab, scaleQuantile } from 'd3';
import { VicAttributeDataDimensionOptions } from './attribute-data';
import { VicValuesBin } from './attribute-data-bin-types';
import { CalculatedRangeBinsAttributeDataDimension } from './calculated-bins';

const DEFAULT = {
  interpolator: interpolateLab,
  numBins: 5,
  scale: scaleQuantile,
};

export interface VicEqualNumObservationsAttributeDataDimensionOptions<
  Datum,
  RangeValue extends string | number = string
> extends VicAttributeDataDimensionOptions<Datum, number, RangeValue> {
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
    this.scale = scaleQuantile;
    this.interpolator = DEFAULT.interpolator;
    this.numBins = DEFAULT.numBins;
    Object.assign(this, options);
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

  getScale(nullColor: string) {
    return this.scale()
      .domain(this.calculatedDomain)
      .range(this.range)
      .unknown(nullColor);
  }
}
