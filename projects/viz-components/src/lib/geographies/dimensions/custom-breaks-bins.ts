import { interpolateLab, scaleThreshold } from 'd3';
import { AttributeDataDimensionConfig } from './attribute-data';
import { VicValuesBin } from './attribute-data-bin-types';

/**
 * Configuration object for attribute data that is quantitative and will be binned into custom breaks. For example, if the data is [0, 1, 2, 4, 60, 100] and breakValues is [0, 2, 5, 10, 50], the bin ranges will be [0, 2], [2, 5], [5, 10], [10, 50], [50, 100].
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicCustomBreaksAttributeDataDimensionConfig<
  Datum
> extends AttributeDataDimensionConfig<Datum, number> {
  binType: VicValuesBin.customBreaks = VicValuesBin.customBreaks;
  breakValues: number[];
  numBins: number;

  constructor(
    init?: Partial<VicCustomBreaksAttributeDataDimensionConfig<Datum>>
  ) {
    super();
    this.colorScale = scaleThreshold;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
    this.numBins = undefined;
  }

  setPropertiesFromData(): void {
    this.setDomainAndBins();
    this.setRange();
  }

  protected setDomainAndBins(): void {
    this.domain = this.breakValues.slice(1);
    this.numBins = this.breakValues.length - 1;
  }

  protected setRange(): void {
    this.range = this.colors;
  }

  getScale(nullColor: string) {
    return this.colorScale()
      .domain(this.domain)
      .range(this.range)
      .unknown(nullColor)
      .interpolate(this.interpolator);
  }
}
