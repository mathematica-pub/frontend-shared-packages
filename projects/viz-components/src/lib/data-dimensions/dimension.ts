import { map } from 'd3';
import { VicDataValue } from '../core/types/values';
import { VicDataDimensionOptions } from './dimension-options';

export abstract class VicDataDimension<Datum, TDataValue extends VicDataValue>
  implements VicDataDimensionOptions<Datum, TDataValue>
{
  readonly formatFunction: (d: Datum) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly valueAccessor: (d: Datum) => TDataValue;
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
