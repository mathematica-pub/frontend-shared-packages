import { extent, interpolateLab, scaleLinear } from 'd3';
import { VicValuesBin } from './attribute-data-bin-types';
import {
  AttributeDataDimension,
  VicAttributeDataDimensionOptions,
} from './attribute-data-dimension';

const DEFAULT = {
  interpolator: interpolateLab,
  nullColor: 'whitesmoke',
  range: ['white', 'slategray'],
  scale: scaleLinear,
};

export interface VicNoBinsAttributeDataDimensionOptions<Datum>
  extends VicAttributeDataDimensionOptions<Datum, number> {
  /**
   * A format specifier that will be applied to the value of this dimension for display purposes.
   */
  formatSpecifier: string;
}

/**
 * Configuration object for attribute data that is quantitative and does not have bins.
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicNoBinsAttributeDataDimension<
  Datum
> extends AttributeDataDimension<Datum, number> {
  readonly binType: VicValuesBin.none;
  domain: [number, number];
  /**
   * A format specifier that will be applied to the value of this dimension for display purposes.
   */
  formatSpecifier: string;

  constructor(options?: Partial<VicNoBinsAttributeDataDimension<Datum>>) {
    super();
    this.binType = VicValuesBin.none;
    this.scale = DEFAULT.scale;
    Object.assign(this, DEFAULT, options);
    if (!this.valueAccessor) {
      console.error(
        'Value accessor is required for NoBinsAttributeDataDimension'
      );
    }
  }

  setPropertiesFromData(data: Datum[]): void {
    const values = data.map(this.valueAccessor);
    this.setDomain(values);
  }

  protected setDomain(values: number[]): void {
    const domainValues = this.domain ?? values;
    this.domain = extent(domainValues);
  }

  getScale() {
    return this.scale()
      .domain(this.domain)
      .range(this.range)
      .unknown(this.nullColor);
  }
}
