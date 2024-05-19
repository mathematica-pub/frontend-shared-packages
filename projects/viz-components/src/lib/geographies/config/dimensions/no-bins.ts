import { extent, interpolateLab, scaleLinear } from 'd3';
import { AttributeDataDimension } from './attribute-data';
import { VicValuesBin } from './attribute-data-bin-types';

const DEFAULT = {
  interpolator: interpolateLab,
  scale: scaleLinear,
};

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
    this.setDomainAndBins(values);
  }

  protected setDomainAndBins(values: number[]): void {
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

export function vicNoBinsAttributeDataDimension<Datum>(
  options?: Partial<VicNoBinsAttributeDataDimension<Datum>>
): VicNoBinsAttributeDataDimension<Datum> {
  return new VicNoBinsAttributeDataDimension<Datum>(options);
}
