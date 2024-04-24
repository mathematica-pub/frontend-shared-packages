import { VicPatternPredicate } from '../../data-marks/data-marks.config';
import {
  VicDataDimension,
  VicDataValue,
} from '../../data-marks/dimensions/data-dimension';

/**
 * Configuration object for attribute data that will be used to shade the map.
 *
 * The generic parameter is the type of the attribute data.
 */
export abstract class AttributeDataDimension<
  Datum,
  AttributeValue extends VicDataValue,
  RangeValue extends string | number = string
> extends VicDataDimension<Datum, AttributeValue> {
  geoAccessor: (d: Datum, ...args: any) => any;
  range: RangeValue[];
  scale: (...args: any) => any;
  interpolator: (...args: any) => any;
  patternPredicates?: VicPatternPredicate<Datum>[];

  protected abstract setDomainAndBins(values: any[]): void;
  abstract getScale(nullColor: string): any;
}
