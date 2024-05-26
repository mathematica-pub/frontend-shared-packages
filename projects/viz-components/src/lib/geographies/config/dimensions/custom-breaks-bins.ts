import { interpolateLab, range, scaleLinear, scaleThreshold } from 'd3';
import {
  AttributeDataDimension,
  VicAttributeDataDimensionOptions,
} from './attribute-data';
import { VicValuesBin } from './attribute-data-bin-types';

const DEFAULT = {
  interpolator: interpolateLab,
  scale: scaleThreshold,
};

export interface VicCustomBreaksAttributeDataDimensionOptions<
  Datum,
  RangeValue extends string | number = string
> extends VicAttributeDataDimensionOptions<Datum, number, RangeValue> {
  breakValues: number[];
}

/**
 * Configuration object for attribute data that is quantitative and will be binned into custom breaks.
 *
 * For example, if the data is [0, 1, 2, 4, 60, 100] and breakValues is [0, 2, 5, 10, 50], the bin ranges will be [0, 2], [2, 5], [5, 10], [10, 50], [50, 100].
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicCustomBreaksAttributeDataDimension<
    Datum,
    RangeValue extends string | number = string
  >
  extends AttributeDataDimension<Datum, number, RangeValue>
  implements VicCustomBreaksAttributeDataDimensionOptions<Datum, RangeValue>
{
  readonly binType: VicValuesBin.customBreaks;
  readonly breakValues: number[];
  private calculatedNumBins: number;
  private domain: number[];
  readonly valueAccessor: (d: Datum, ...args: any) => number;

  constructor(
    options?: Partial<
      VicCustomBreaksAttributeDataDimensionOptions<Datum, RangeValue>
    >
  ) {
    super();
    this.binType = VicValuesBin.customBreaks;
    this.scale = DEFAULT.scale;
    this.interpolator = DEFAULT.interpolator;
    Object.assign(this, options);
    this.calculatedNumBins = undefined;
  }

  setPropertiesFromData(): void {
    this.setDomain();
    this.setNumBins();
    this.setRange();
  }

  protected setDomain(): void {
    this.domain = this.breakValues.slice(1);
  }

  private setNumBins(): void {
    this.calculatedNumBins = this.breakValues.length - 1;
  }

  protected setRange(): void {
    if (this.range.length < this.calculatedNumBins) {
      const scale = scaleLinear<RangeValue>()
        .domain([0, this.calculatedNumBins - 1])
        .range(this.range);
      this.range = range(this.calculatedNumBins).map((i) => scale(i));
    }
  }

  getScale(nullColor: string) {
    return this.scale()
      .domain(this.domain)
      .range(this.range)
      .unknown(nullColor);
  }
}

export function vicCustomBreaksAttributeDataDimension<
  Datum,
  RangeValue extends string | number = string
>(
  options?: Partial<
    VicCustomBreaksAttributeDataDimensionOptions<Datum, RangeValue>
  >
): VicCustomBreaksAttributeDataDimension<Datum, RangeValue> {
  return new VicCustomBreaksAttributeDataDimension<Datum, RangeValue>(options);
}
