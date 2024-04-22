import { extent, interpolateLab, scaleLinear } from 'd3';
import { AttributeDataDimensionConfig } from './attribute-data';
import { VicValuesBin } from './attribute-data-bin-types';

/**
 * Configuration object for attribute data that is quantitative.
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicNoBinsAttributeDataDimensionConfig<
  Datum
> extends AttributeDataDimensionConfig<Datum, number> {
  binType: VicValuesBin.none = VicValuesBin.none;

  constructor(init?: Partial<VicNoBinsAttributeDataDimensionConfig<Datum>>) {
    super();
    this.colorScale = scaleLinear;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
  }

  setPropertiesFromData(values: any[]): void {
    this.setDomainAndBins(values);
    this.setRange();
  }

  protected setDomainAndBins(values: any[]): void {
    const domainValues = this.domain ?? values;
    this.domain = extent(domainValues);
  }

  protected setRange(): void {
    this.range = this.colors;
  }

  getScale(nullColor: string) {
    return this.colorScale()
      .domain(this.domain)
      .range(this.range)
      .unknown(nullColor);
  }
}
