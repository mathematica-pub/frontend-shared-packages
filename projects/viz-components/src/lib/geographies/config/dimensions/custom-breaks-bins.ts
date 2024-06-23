import { interpolateLab, range, scaleLinear, scaleThreshold } from 'd3';
import { VicValuesBin } from './attribute-data-bin-types';
import { AttributeDataDimension } from './attribute-data-dimension';
import { CalculatedRangeBinsAttributeDataDimensionOptions } from './calculated-bins';

const DEFAULT = {
  interpolator: interpolateLab,
  nullColor: 'whitesmoke',
  scale: scaleThreshold,
};

export interface VicCustomBreaksAttributeDataDimensionOptions<
  Datum,
  RangeValue extends string | number = string
> extends CalculatedRangeBinsAttributeDataDimensionOptions<Datum, RangeValue> {
  breakValues: number[];
  /**
   * A format specifier that will be applied to the value of this dimension for display purposes.
   */
  formatSpecifier: string;
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
  private calculatedDomain: number[];
  readonly formatSpecifier: string;

  constructor(
    options?: Partial<
      VicCustomBreaksAttributeDataDimensionOptions<Datum, RangeValue>
    >
  ) {
    super();
    this.binType = VicValuesBin.customBreaks;
    Object.assign(this, DEFAULT, options);
    this.calculatedNumBins = undefined;
    if (!this.valueAccessor) {
      console.error(
        'Value accessor is required for CustomBreaksAttributeDataDimension'
      );
    }
  }

  setPropertiesFromData(): void {
    this.setDomain();
    this.setNumBins();
    this.setRange();
  }

  protected setDomain(): void {
    this.calculatedDomain = this.breakValues.slice(1);
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

  getScale() {
    return this.scale()
      .domain(this.calculatedDomain)
      .range(this.range)
      .unknown(this.nullColor);
  }
}
