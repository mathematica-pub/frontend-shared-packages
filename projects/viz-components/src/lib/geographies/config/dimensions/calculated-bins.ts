import { extent, range, scaleLinear } from 'd3';
import {
  AttributeDataDimension,
  VicAttributeDataDimensionOptions,
} from './attribute-data-dimension';

export interface CalculatedRangeBinsAttributeDataDimensionOptions<
  Datum,
  RangeValue extends string | number = string
> extends VicAttributeDataDimensionOptions<Datum, number, RangeValue> {
  formatSpecifier: string;
}

export abstract class CalculatedRangeBinsAttributeDataDimension<
  Datum,
  RangeValue extends string | number = string
> extends AttributeDataDimension<Datum, number, RangeValue> {
  protected calculatedNumBins: number;
  /**
   * A format specifier that will be applied to the value of this dimension for display purposes.
   */
  readonly formatSpecifier: string;
  readonly valueAccessor: (d: Datum) => number;

  protected setRange(): void {
    if (this.shouldCalculateBinColors(this.calculatedNumBins, this.range)) {
      const binIndicies = range(this.calculatedNumBins);
      this.range = binIndicies.map((i) =>
        this.getColorGenerator(binIndicies)(i)
      );
    }
  }

  private shouldCalculateBinColors(
    numBins: number,
    range: RangeValue[]
  ): boolean {
    return numBins > 1 && range.length !== numBins;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getColorGenerator(binIndicies: number[]): any {
    return scaleLinear<RangeValue>()
      .domain(extent(binIndicies))
      .range(this.range)
      .interpolate(this.interpolator);
  }
}
