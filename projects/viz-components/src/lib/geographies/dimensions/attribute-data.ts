import { extent, scaleLinear } from 'd3';
import { VicPatternPredicate } from '../../data-marks/data-marks.config';
import {
  VicDataDimensionConfig,
  VicDataValue,
} from '../../data-marks/dimensions/data-dimension';

/**
 * Configuration object for attribute data that will be used to shade the map.
 *
 * The generic parameter is the type of the attribute data.
 */
export abstract class AttributeDataDimensionConfig<
  Datum,
  AttributeValue extends VicDataValue
> extends VicDataDimensionConfig<Datum, AttributeValue> {
  geoAccessor: (d: Datum, ...args: any) => any;
  range: string[];
  scale: (...args: any) => any;
  colors: string[];
  interpolator: (...args: any) => any;
  patternPredicates?: VicPatternPredicate<Datum>[];

  protected abstract setDomainAndBins(values: any[]): void;
  protected abstract setRange(): void;
  abstract getScale(nullColor: string): any;

  shouldCalculateBinColors(numBins: number, colors: string[]): boolean {
    return numBins > 1 && colors.length !== numBins;
  }

  getColorGenerator(binIndicies: number[]): any {
    return scaleLinear<string>()
      .domain(extent(binIndicies))
      .range(this.colors)
      .interpolate(this.interpolator);
  }
}
