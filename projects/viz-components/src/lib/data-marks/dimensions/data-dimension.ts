import { map } from 'd3';
import { VicFormatSpecifier } from '../../value-format/value-format';

export enum VicDimension {
  'quantitative' = 'quantitative',
  'categorical' = 'categorical',
  'ordinal' = 'ordinal',
  'date' = 'date',
}

export type VicDataValue = number | string | Date;

export abstract class VicDataDimension<Datum, TDataValue extends VicDataValue> {
  /**
   * An array of values for this dimension, extracted from the data using the value accessor.
   * @see {@link valueAccessor}
   */
  values: TDataValue[];
  /**
   * A user-provided method that extracts the value for this dimension from a datum.
   */
  valueAccessor: (d: Datum, ...args: any) => TDataValue;
  /**
   * A formatter (function or string) for the values of this dimension.
   */
  valueFormat?: VicFormatSpecifier<Datum>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract setPropertiesFromData(data: Datum[], ...args: any): void;

  protected setValues(data: Datum[]): void {
    this.values = map(data, this.valueAccessor);
  }
}
