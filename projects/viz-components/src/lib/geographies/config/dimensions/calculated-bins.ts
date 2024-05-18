import { extent, range, scaleLinear } from 'd3';
import { VicDataValue } from '../../../core/types/values';
import {
  AttributeDataDimension,
  VicAttributeDataDimensionOptions,
} from './attribute-data';

export interface VicCalculatedRangeBinsAttributeDataDimensionOptions<
  Datum,
  AttributeValue extends VicDataValue,
  RangeValue extends string | number = string
> extends VicAttributeDataDimensionOptions<Datum, AttributeValue, RangeValue> {
  numBins: number;
}

export abstract class CalculatedRangeBinsAttributeDataDimension<
  Datum,
  AttributeValue extends VicDataValue,
  RangeValue extends string | number = string
> extends AttributeDataDimension<Datum, AttributeValue, RangeValue> {
  numBins: number;

  protected setRange(): void {
    if (this.shouldCalculateBinColors(this.numBins, this.range)) {
      const binIndicies = range(this.numBins);
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

  private getColorGenerator(binIndicies: number[]): any {
    return scaleLinear<RangeValue>()
      .domain(extent(binIndicies))
      .range(this.range)
      .interpolate(this.interpolator);
  }
}
