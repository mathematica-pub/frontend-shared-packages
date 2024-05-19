import { interpolateLab, scaleQuantile } from 'd3';
import { VicValuesBin } from './attribute-data-bin-types';
import {
  CalculatedRangeBinsAttributeDataDimension,
  VicCalculatedRangeBinsAttributeDataDimensionOptions,
} from './calculated-bins';

const DEFAULT = {
  interpolator: interpolateLab,
  numBins: 5,
  scale: scaleQuantile,
};

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
    VicCalculatedRangeBinsAttributeDataDimensionOptions<
      Datum,
      number,
      RangeValue
    >
{
  readonly binType: VicValuesBin.equalNumObservations;
  domain: number[];

  constructor(
    options?: Partial<
      VicCalculatedRangeBinsAttributeDataDimensionOptions<
        Datum,
        number,
        RangeValue
      >
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
    this.setDomainAndBins(values);
    this.setRange();
  }

  protected setDomainAndBins(values: number[]): void {
    this.domain = values;
  }

  getScale(nullColor: string) {
    return this.scale()
      .domain(this.domain)
      .range(this.range)
      .unknown(nullColor);
  }
}

export function vicEqualNumObservationsAttributeDataDimension<
  Datum,
  RangeValue extends string | number = string
>(
  options?: Partial<
    VicCalculatedRangeBinsAttributeDataDimensionOptions<
      Datum,
      number,
      RangeValue
    >
  >
): VicEqualNumObservationsAttributeDataDimension<Datum, RangeValue> {
  return new VicEqualNumObservationsAttributeDataDimension<Datum, RangeValue>(
    options
  );
}
