import { interpolateLab, scaleQuantile } from 'd3';
import { VicValuesBin } from './attribute-data-bin-types';
import { CalculatedRangeBinsAttributeDataDimension } from './calculated-bins';

/**
 * Configuration object for attribute data that is quantitative and will be binned into equal number of observations. For example, if the data is [0, 1, 2, 4, 60, 100] and numBins is 2, the bin ranges will be [0, 2] and [4, 100].
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicEqualNumObservationsAttributeDataDimension<
  Datum,
  RangeValue extends string | number = string
> extends CalculatedRangeBinsAttributeDataDimension<Datum, number, RangeValue> {
  domain: number[];
  binType: VicValuesBin.equalNumObservations =
    VicValuesBin.equalNumObservations;

  constructor(
    init?: Partial<VicEqualNumObservationsAttributeDataDimension<Datum>>
  ) {
    super();
    this.scale = scaleQuantile;
    this.interpolator = interpolateLab;
    this.numBins = 5;
    Object.assign(this, init);
  }

  setPropertiesFromData(values: any[]): void {
    this.setDomainAndBins(values);
    this.setRange();
  }

  protected setDomainAndBins(values: any[]): void {
    this.domain = values;
  }

  getScale(nullColor: string) {
    return this.scale()
      .domain(this.domain)
      .range(this.range)
      .unknown(nullColor);
  }
}
