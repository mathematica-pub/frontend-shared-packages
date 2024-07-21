import { BinStrategy } from '../attribute-data-bin-enums';
import { AttributeDataDimension } from '../attribute-data/attribute-data-dimension';
import { CategoricalBinsOptions } from './categorical-bins-options';

/**
 * Configuration object for attribute data that is categorical.
 *
 * The generic parameter is the type of the attribute data.
 */
export class CategoricalBinsAttributeDataDimension<
    Datum,
    RangeValue extends string | number = string
  >
  extends AttributeDataDimension<Datum, string>
  implements CategoricalBinsOptions<Datum, string>
{
  readonly binType: BinStrategy.categorical;
  calculatedDomain: string[];
  readonly domain: string[];
  override interpolator: never;

  constructor(options: CategoricalBinsOptions<Datum, RangeValue>) {
    super();
    this.binType = BinStrategy.categorical;
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
