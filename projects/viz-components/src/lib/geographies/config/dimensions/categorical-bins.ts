import { scaleOrdinal } from 'd3';
import {
  AttributeDataDimension,
  VicAttributeDataDimensionOptions,
} from './attribute-data';
import { VicValuesBin } from './attribute-data-bin-types';

const DEFAULT = {
  range: ['white', 'lightslategray'],
  scale: scaleOrdinal,
};

export interface VicCategoricalAttributeDataDimensionOptions<
  Datum,
  RangeValue extends string | number = string
> extends VicAttributeDataDimensionOptions<Datum, RangeValue> {
  domain: string[];
}

/**
 * Configuration object for attribute data that is categorical.
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicCategoricalAttributeDataDimension<
  Datum,
  RangeValue extends string | number = string
> extends AttributeDataDimension<Datum, string> {
  readonly binType: VicValuesBin.categorical;
  domain: string[];
  override interpolator: never;
  readonly valueAccessor: (d: Datum, ...args: any) => string;

  constructor(
    options?: Partial<
      VicCategoricalAttributeDataDimensionOptions<Datum, RangeValue>
    >
  ) {
    super();
    this.binType = VicValuesBin.categorical;
    this.range = DEFAULT.range;
    this.scale = DEFAULT.scale;
    Object.assign(this, options);
  }

  setPropertiesFromData(data: Datum[]): void {
    const values = data.map(this.valueAccessor);
    this.setDomainAndBins(values);
    this.setRange();
  }

  protected setDomainAndBins(values: string[]): void {
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

export function vicCategoricalAttributeDataDimension<
  Datum,
  RangeValue extends string | number = string
>(
  options?: Partial<
    VicCategoricalAttributeDataDimensionOptions<Datum, RangeValue>
  >
): VicCategoricalAttributeDataDimension<Datum, RangeValue> {
  return new VicCategoricalAttributeDataDimension<Datum, RangeValue>(options);
}
