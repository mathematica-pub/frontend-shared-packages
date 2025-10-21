import { safeAssign } from '@mathstack/app-kit';
import { range, scaleLinear } from 'd3';
import { BinStrategy } from '../attribute-data-bin-enums';
import { AttributeDataDimension } from '../attribute-data/attribute-data-dimension';
import { CustomBreaksBinsAttributeDataDimensionOptions } from './custom-breaks-bins-options';

/**
 * Configuration object for attribute data that is quantitative and will be binned into custom breaks.
 *
 * For example, if the data is [0, 1, 2, 4, 60, 100] and breakValues is [0, 2, 5, 10, 50], the bin ranges will be [0, 2], [2, 5], [5, 10], [10, 50], [50, 100].
 *
 * The generic parameter is the type of the attribute data.
 */
export class CustomBreaksBinsAttributeDataDimension<
  Datum,
  RangeValue extends string | number = string,
>
  extends AttributeDataDimension<Datum, number, RangeValue>
  implements CustomBreaksBinsAttributeDataDimensionOptions<Datum, RangeValue> {
  override readonly binType: BinStrategy.customBreaks;
  readonly breakValues: number[];
  private calculatedNumBins: number;
  private calculatedDomain: number[];
  readonly formatSpecifier: string;

  constructor(
    options: CustomBreaksBinsAttributeDataDimensionOptions<Datum, RangeValue>
  ) {
    super('number');
    this.binType = BinStrategy.customBreaks;
    safeAssign(this, options);
    if (!this.valueAccessor) {
      console.error(
        'Value accessor is required for CustomBreaksAttributeDataDimension'
      );
    }
    if (!this.breakValues) {
      console.error(
        'breakValues are required for CustomBreaksAttributeDataDimension'
      );
    }
    if (this.breakValues.length < 2) {
      console.error(
        'breakValues must have at least two values for CustomBreaksAttributeDataDimension'
      );
    }
    this.breakValues = this.breakValues.slice().sort((a, b) => a - b);
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
    // the D3.ScaleThreshold domain is an array of naturally ordered values, which are typically numbers but could also be strings. Thus if scale is called with a string value here, it scale will return the first value of the range, not the nullColor. See https://d3js.org/d3-scale/threshold#threshold_domain.
    return this.scale()
      .domain(this.calculatedDomain)
      .range(this.range)
      .unknown(this.nullColor);
  }
}
