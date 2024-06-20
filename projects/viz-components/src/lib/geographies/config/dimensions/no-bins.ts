import { extent, interpolateLab, scaleLinear } from 'd3';
import {
  AttributeDataDimension,
  VicAttributeDataDimensionOptions,
} from './attribute-data';
import { VicValuesBin } from './attribute-data-bin-types';

const DEFAULT = {
  interpolator: interpolateLab,
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
 * Configuration object for attribute data that is quantitative.
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly valueAccessor: (d: Datum, ...args: any) => number;

  constructor(options?: Partial<VicNoBinsAttributeDataDimension<Datum>>) {
    super();
    this.binType = VicValuesBin.none;
    this.scale = DEFAULT.scale;
    this.interpolator = DEFAULT.interpolator;
    Object.assign(this, options);
  }

  setPropertiesFromData(data: Datum[]): void {
    const values = data.map(this.valueAccessor);
    this.setDomain(values);
  }

  protected setDomain(values: number[]): void {
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
