import { map } from 'd3';
import { VicDataValue } from '../core/types/values';

export interface VicDataDimensionOptions<
  Datum,
  TDataValue extends VicDataValue
> {
  /**
   * A user-provided method that extracts the value for this dimension from a datum.
   */
  valueAccessor: (d: Datum) => TDataValue;
  /**
   * A function that will be applied to the value of this dimension for display purposes. If provided, this function will be used instead of the format specifier (available only for quantitative dimensions)
   */
  formatFunction: (d: Datum) => string;
}

export abstract class VicDataDimension<Datum, TDataValue extends VicDataValue>
  implements VicDataDimensionOptions<Datum, TDataValue>
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract readonly valueAccessor: (d: Datum) => TDataValue;
  readonly formatFunction: (d: Datum) => string;
  /**
   * An array of values for this dimension, extracted from the data using the value accessor.
   * @see {@link valueAccessor}
   */
  values: TDataValue[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract setPropertiesFromData(data: Datum[], ...args: any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract setDomain(...args: any): void;
  protected setValues(data: Datum[]): void {
    this.values = map(data, this.valueAccessor);
  }
}
