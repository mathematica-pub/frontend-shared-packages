import {
  VicDataDimension,
  VicDataValue,
} from '../../data-marks/dimensions/data-dimension';
import { VicFillPattern } from '../../data-marks/dimensions/fill-pattern';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geoAccessor: (d: Datum, ...args: any) => any;
  range: RangeValue[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: (...args: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interpolator: (...args: any) => any;
  fillPatterns: VicFillPattern<Datum>[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract setDomainAndBins(values: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract getScale(nullColor: string): any;
}
