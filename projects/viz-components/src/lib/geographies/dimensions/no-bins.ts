import { extent, interpolateLab, scaleLinear } from 'd3';
import { AttributeDataDimension } from './attribute-data';
import { VicValuesBin } from './attribute-data-bin-types';

/**
 * Configuration object for attribute data that is quantitative.
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicNoBinsAttributeDataDimension<
  Datum
> extends AttributeDataDimension<Datum, number> {
  domain: [number, number];
  binType: VicValuesBin.none = VicValuesBin.none;

  constructor(init?: Partial<VicNoBinsAttributeDataDimension<Datum>>) {
    super();
    this.scale = scaleLinear;
    this.interpolator = interpolateLab;
    Object.assign(this, init);
  }

  setPropertiesFromData(values: any[]): void {
    this.setDomainAndBins(values);
  }

  protected setDomainAndBins(values: any[]): void {
    const domainValues = this.domain ?? values;
    this.domain = extent(domainValues);
  }

  getScale(nullColor: string) {
    return this.scale()
      .domain(this.domain)
      .range(this.range)
      .unknown(nullColor);
  }
}
