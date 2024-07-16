import { extent, range, scaleLinear } from 'd3';
import { AttributeDataDimension } from '../attribute-data/attribute-data-dimension';

export abstract class CalculatedRangeBinsAttributeDataDimension<
  Datum,
  RangeValue extends string | number = string
> extends AttributeDataDimension<Datum, number, RangeValue> {
  protected calculatedNumBins: number;
  readonly formatSpecifier: string;

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
