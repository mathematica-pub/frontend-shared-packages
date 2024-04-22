import { scaleOrdinal } from 'd3';
import { AttributeDataDimensionConfig } from './attribute-data';
import { VicValuesBin } from './attribute-data-bin-types';

/**
 * Configuration object for attribute data that is categorical.
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicCategoricalAttributeDataDimensionConfig<
  Datum
> extends AttributeDataDimensionConfig<Datum, string> {
  binType: VicValuesBin.categorical = VicValuesBin.categorical;
  override interpolator: never;
  override domain: string[];

  constructor(
    init?: Partial<VicCategoricalAttributeDataDimensionConfig<Datum>>
  ) {
    super();
    this.colorScale = scaleOrdinal;
    this.colors = ['white', 'lightslategray'];
    Object.assign(this, init);
  }

  setPropertiesFromData(values: any[]): void {
    throw new Error('Method not implemented.');
  }

  protected setDomainAndBins(values: any[]): void {
    const domainValues = this.domain ?? values;
    this.domain = [...new Set(domainValues)];
  }

  protected setRange(): void {
    this.range = this.colors.slice(0, this.domain.length);
  }

  getScale(nullColor: string) {
    return this.colorScale()
      .domain(this.domain)
      .range(this.range)
      .unknown(nullColor)
      .interpolate(this.interpolator);
  }
}
