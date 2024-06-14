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
  private calculatedDomain: string[];
  readonly domain: string[];
  override interpolator: never;
  readonly valueAccessor: (d: Datum) => string;

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

  getScale(nullColor: string) {
    return this.scale()
      .domain(this.calculatedDomain)
      .range(this.range)
      .unknown(nullColor);
  }
}
