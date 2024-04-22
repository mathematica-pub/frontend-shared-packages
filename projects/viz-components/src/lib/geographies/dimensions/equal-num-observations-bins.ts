import { interpolateLab, range, scaleQuantile } from 'd3';
import { AttributeDataDimensionConfig } from './attribute-data';
import { VicValuesBin } from './attribute-data-bin-types';

/**
 * Configuration object for attribute data that is quantitative and will be binned into equal number of observations. For example, if the data is [0, 1, 2, 4, 60, 100] and numBins is 2, the bin ranges will be [0, 2] and [4, 100].
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicEqualNumbersAttributeDataDimensionConfig<
  Datum
> extends AttributeDataDimensionConfig<Datum, number> {
  binType: VicValuesBin.equalNumObservations =
    VicValuesBin.equalNumObservations;
  numBins: number;

  constructor(
    init?: Partial<VicEqualNumbersAttributeDataDimensionConfig<Datum>>
  ) {
    super();
    this.colorScale = scaleQuantile;
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

  protected setRange(): void {
    if (this.shouldCalculateBinColors(this.numBins, this.colors)) {
      const binIndicies = range(this.numBins);
      this.range = binIndicies.map((i) =>
        this.getColorGenerator(binIndicies)(i)
      );
    } else {
      this.range = this.colors;
    }
  }

  getScale(nullColor: string) {
    return this.colorScale()
      .domain(this.domain)
      .range(this.range)
      .unknown(nullColor)
      .interpolate(this.interpolator);
  }
}
