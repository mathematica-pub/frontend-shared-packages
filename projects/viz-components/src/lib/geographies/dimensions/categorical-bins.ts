import { scaleOrdinal } from 'd3';
import { AttributeDataDimension } from './attribute-data';
import { VicValuesBin } from './attribute-data-bin-types';

/**
 * Configuration object for attribute data that is categorical.
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicCategoricalAttributeDataDimension<
  Datum
> extends AttributeDataDimension<Datum, string> {
  domain: string[];
  binType: VicValuesBin.categorical = VicValuesBin.categorical;
  override interpolator: never;

  constructor(init?: Partial<VicCategoricalAttributeDataDimension<Datum>>) {
    super();
    this.scale = scaleOrdinal;
    this.range = ['white', 'lightslategray'];
    Object.assign(this, init);
  }

  setPropertiesFromData(values: any[]): void {
    this.setDomainAndBins(values);
    this.setRange();
  }

  protected setDomainAndBins(values: any[]): void {
    const domainValues = this.domain ?? values;
    this.domain = [...new Set(domainValues)];
  }

  protected setRange(): void {
    this.range = this.range.slice(0, this.domain.length);
  }

  getScale(nullColor: string) {
    return this.scale()
      .domain(this.domain)
      .range(this.range)
      .unknown(nullColor);
  }
}
