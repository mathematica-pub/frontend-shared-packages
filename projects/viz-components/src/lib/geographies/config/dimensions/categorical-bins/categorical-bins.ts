import { VicValuesBin } from '../attribute-data-bin-types';
import { AttributeDataDimension } from '../attribute-data/attribute-data-dimension';
import { VicCategoricalAttributeDataDimensionOptions } from './categorical-bins-options';

/**
 * Configuration object for attribute data that is categorical.
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicCategoricalAttributeDataDimension<
    Datum,
    RangeValue extends string | number = string
  >
  extends AttributeDataDimension<Datum, string>
  implements VicCategoricalAttributeDataDimensionOptions<Datum, string>
{
  readonly binType: VicValuesBin.categorical;
  calculatedDomain: string[];
  readonly domain: string[];
  override interpolator: never;

  constructor(
    options?: Partial<
      VicCategoricalAttributeDataDimensionOptions<Datum, RangeValue>
    >
  ) {
    super();
    this.binType = VicValuesBin.categorical;
    Object.assign(this, options);
  }

  getDomain(): string[] {
    return this.calculatedDomain;
  }

  setPropertiesFromData(data: Datum[]): void {
    const values = data.map(this.valueAccessor);
    this.setDomain(values);
    this.setRange();
  }

  protected setDomain(values: string[]): void {
    const domainValues = this.domain ?? values;
    this.calculatedDomain = [...new Set(domainValues)];
  }

  protected setRange(): void {
    this.range = this.range.slice(0, this.calculatedDomain.length);
  }

  getScale() {
    return this.scale()
      .domain(this.calculatedDomain)
      .range(this.range)
      .unknown(this.nullColor);
  }
}
